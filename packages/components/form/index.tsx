'use client';
import Schema from 'async-validator';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FieldValidationContext, FormContext, cx, useControllable, useNamespace, useSize } from '../../hooks';
import { cloneValue, getFieldValue, pathKey, setFieldValue } from './path';
import type { FormPath } from './path';
import type { RuleItem, ValidateFieldsError } from 'async-validator';
import type { BaseProps, ComponentSize } from '../../hooks';
import type { ReactNode, Ref } from 'react';

export type FormRule = RuleItem & { trigger?: string | string[] };
export type FormRules = Record<string, FormRule | FormRule[]>;
export type FormValidateCallback = (valid: boolean, fields?: ValidateFieldsError) => void;
export interface FormItemHandle {
  readonly prop: FormPath | undefined;
  readonly size: ComponentSize | undefined;
  readonly validateMessage: string;
  readonly validateState: '' | 'validating' | 'success' | 'error';
  validate: (trigger?: string, callback?: FormValidateCallback) => Promise<boolean>;
  resetField: () => void;
  clearValidate: () => void;
  setInitialValue: (value: unknown) => void;
}
export interface FormHandle {
  validate: (callback?: FormValidateCallback) => Promise<boolean>;
  validateField: (props?: FormPath | FormPath[], callback?: FormValidateCallback) => Promise<boolean>;
  resetFields: (props?: FormPath | FormPath[]) => void;
  scrollToField: (prop: FormPath) => void;
  clearValidate: (props?: FormPath | FormPath[]) => void;
  readonly fields: FormItemHandle[];
  getField: (prop: FormPath) => FormItemHandle | undefined;
  setInitialValues: (model: Record<string, unknown>) => void;
}
export interface FormProps extends Omit<BaseProps, 'children'> {
  model?: Record<string, unknown>;
  defaultModel?: Record<string, unknown>;
  onModelChange?: (model: Record<string, unknown>) => void;
  rules?: FormRules;
  inline?: boolean;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
  hideRequiredAsterisk?: boolean;
  requireAsteriskPosition?: 'left' | 'right';
  showMessage?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  validateOnRuleChange?: boolean;
  size?: ComponentSize;
  disabled?: boolean;
  scrollToError?: boolean;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  onValidate?: (prop: FormPath, valid: boolean, message: string) => void;
  children?: ReactNode;
  ref?: Ref<FormHandle>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}
interface RegisteredField {
  handle: FormItemHandle;
  node: () => HTMLElement | null;
  getInitialValue: () => unknown;
}
interface FormEnvironment {
  props: FormProps;
  model: Record<string, unknown>;
  setField: (path: FormPath, value: unknown) => void;
  register: (key: string, field: RegisteredField) => () => void;
  notify: (prop: FormPath, valid: boolean, message: string) => void;
}
const Environment = createContext<FormEnvironment | null>(null);

/** Form协调字段和校验；React受控模型通过onModelChange更新，不就地改父对象。 */
export function Form({
  model,
  defaultModel = {},
  onModelChange,
  rules,
  inline = false,
  labelPosition = 'right',
  labelWidth = '',
  labelSuffix = '',
  hideRequiredAsterisk = false,
  requireAsteriskPosition = 'left',
  showMessage = true,
  inlineMessage = false,
  statusIcon = false,
  validateOnRuleChange = true,
  size,
  disabled = false,
  scrollToError = false,
  scrollIntoViewOptions = true,
  onValidate,
  children,
  ref,
  className,
  onSubmit,
  ...rest
}: FormProps) {
  const ns = useNamespace('form');
  const actualSize = useSize(size);
  const [current, setCurrent] = useControllable(model, defaultModel, onModelChange);
  const fields = useRef(new Map<string, RegisteredField>());
  const initial = useRef(new Map<string, unknown>());
  const latestModel = useRef(current);
  const updater = useRef(setCurrent);
  latestModel.current = current;
  updater.current = setCurrent;
  const props: FormProps = {
    rules,
    inline,
    labelPosition,
    labelWidth,
    labelSuffix,
    hideRequiredAsterisk,
    requireAsteriskPosition,
    showMessage,
    inlineMessage,
    statusIcon,
    validateOnRuleChange,
    size: actualSize,
    disabled,
    scrollToError,
    scrollIntoViewOptions,
  };
  /** 字段注册幂等，StrictMode重挂载不覆盖初始快照。 */
  const register = useCallback((key: string, field: RegisteredField) => {
    fields.current.set(key, field);
    if (!initial.current.has(key))
      initial.current.set(key, cloneValue(getFieldValue(latestModel.current, key)));
    field.handle.setInitialValue(initial.current.get(key));
    return () => {
      if (fields.current.get(key) === field) {
        initial.current.set(key, cloneValue(field.getInitialValue()));
        fields.current.delete(key);
      }
    };
  }, []);
  /** 稳定的字段更新入口让注册/注销不依赖整个模型对象。 */
  const setField = useCallback((path: FormPath, value: unknown) => {
    updater.current(setFieldValue(latestModel.current, path, value));
  }, []);
  /** 查询指定字段，点路径数组优先匹配已注册的整路径。 */
  function selected(selection?: FormPath | FormPath[]): RegisteredField[] {
    if (selection === undefined) return [...fields.current.values()];
    if (Array.isArray(selection)) {
      if (
        selection.every((item) => typeof item === 'string') &&
        fields.current.has((selection as string[]).join('.'))
      )
        return [fields.current.get((selection as string[]).join('.'))!];
      return (selection as FormPath[]).flatMap((path) => {
        const field = fields.current.get(pathKey(path));
        return field ? [field] : [];
      });
    }
    const field = fields.current.get(selection);
    return field ? [field] : [];
  }
  /** 校验失败时无callback返回reject，有callback时返回false并提供字段错误。 */
  async function validateField(
    selection?: FormPath | FormPath[],
    callback?: FormValidateCallback,
  ): Promise<boolean> {
    const errors: ValidateFieldsError = {};
    await Promise.all(
      selected(selection).map(async (field) => {
        try {
          await field.handle.validate('');
        } catch (error) {
          if (error && typeof error === 'object') Object.assign(errors, error);
        }
      }),
    );
    if (Object.keys(errors).length) {
      if (scrollToError) {
        const first = Object.keys(errors)[0];
        fields.current.get(first)?.node()?.scrollIntoView(scrollIntoViewOptions);
      }
      callback?.(false, errors);
      if (!callback) throw errors;
      return false;
    }
    callback?.(true);
    return true;
  }
  /** 重置选择字段后一次性提交新模型，避免多字段重置互相覆盖。 */
  function resetFields(selection?: FormPath | FormPath[]): void {
    let next = latestModel.current;
    for (const field of selected(selection)) {
      if (field.handle.prop !== undefined) {
        const key = pathKey(field.handle.prop);
        next = setFieldValue(next, key, field.getInitialValue());
        field.handle.clearValidate();
      }
    }
    updater.current(next);
  }
  /** 仅更新初始快照，当前输入值不随此调用变化。 */
  function setInitialValues(next: Record<string, unknown>): void {
    for (const [key, field] of fields.current) {
      const value = getFieldValue(next, key);
      initial.current.set(key, cloneValue(value));
      field.handle.setInitialValue(value);
    }
  }
  useImperativeHandle(ref, () => ({
    validate: (callback) => validateField(undefined, callback),
    validateField,
    resetFields,
    scrollToField: (path) => fields.current.get(pathKey(path))?.node()?.scrollIntoView(scrollIntoViewOptions),
    clearValidate: (selection) => selected(selection).forEach((field) => field.handle.clearValidate()),
    get fields() {
      return [...fields.current.values()].map((field) => field.handle);
    },
    getField: (path) => fields.current.get(pathKey(path))?.handle,
    setInitialValues,
  }));
  const previousRules = useRef(rules);
  const validationRunner = useRef(validateField);
  validationRunner.current = validateField;
  useEffect(() => {
    if (previousRules.current !== rules) {
      previousRules.current = rules;
      if (validateOnRuleChange) void validationRunner.current().catch(() => undefined);
    }
  }, [rules, validateOnRuleChange]);
  return (
    <FormContext value={{ size: actualSize, disabled, resetFields }}>
      <Environment
        value={{
          props,
          model: current,
          setField,
          register,
          notify: (path, valid, message) => onValidate?.(path, valid, message),
        }}
      >
        <form
          {...rest}
          onSubmit={onSubmit}
          className={cx(
            ns.b,
            ns.m(actualSize ?? 'default'),
            ns.m(`label-${labelPosition}`),
            ns.m(inline ? 'inline' : ''),
            className,
          )}
        >
          {children}
        </form>
      </Environment>
    </FormContext>
  );
}

export interface FormItemProps extends Omit<BaseProps, 'children'> {
  prop?: FormPath;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  required?: boolean;
  rules?: FormRule | FormRule[];
  error?: string;
  showMessage?: boolean;
  inlineMessage?: boolean;
  size?: ComponentSize;
  for?: string;
  validateStatus?: '' | 'validating' | 'success' | 'error';
  renderLabel?: ReactNode;
  renderError?: (scope: { error: string }) => ReactNode;
  children?: ReactNode | ((field: { value: unknown; setValue: (value: unknown) => void }) => ReactNode);
  ref?: Ref<FormItemHandle>;
}

/** 字段保留独立校验序号，较旧异步校验和清理后的结果不会覆盖新状态。 */
export function FormItem({
  prop,
  label,
  labelPosition,
  labelWidth,
  required,
  rules,
  error,
  showMessage,
  inlineMessage,
  size,
  for: htmlFor,
  validateStatus,
  renderLabel,
  renderError,
  children,
  ref,
  className,
  style,
  ...rest
}: FormItemProps) {
  const ns = useNamespace('form-item');
  const form = useContext(Environment);
  const inherited = useContext(FormContext);
  const actualSize = useSize(size);
  const node = useRef<HTMLDivElement>(null);
  const id = useId();
  const [inputId, setInputId] = useState<string>();
  useEffect(() => {
    const root = node.current;
    if (!root) return;
    /** 单控件关联label，多控件保留分组语义；子控件动态挂载时重新检测。 */
    function associate(): void {
      const inputs = root!.querySelectorAll<HTMLElement>('input:not([type="hidden"]),textarea,select');
      if (inputs.length === 1) {
        if (!inputs[0].id) inputs[0].id = `${id}-input`;
        setInputId(inputs[0].id);
      } else setInputId(undefined);
    }
    associate();
    const observer = new MutationObserver(associate);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [id]);
  const sequence = useRef(0);
  const initial = useRef<unknown>(undefined);
  const [state, setState] = useState<{ status: '' | 'validating' | 'success' | 'error'; message: string }>({
    status: '',
    message: '',
  });
  const latest = useRef({ form, prop, rules, required });
  latest.current = { form, prop, rules, required };
  /** 清除会使进行中的旧请求失效。 */
  const clearValidate = useCallback(() => {
    sequence.current++;
    setState({ status: '', message: '' });
  }, []);
  /** 只验证匹配触发方式的规则；手动全量校验使用空trigger。 */
  const validate = useCallback(
    async (
      trigger = '',
      callback?: FormValidateCallback,
      override?: { value: unknown },
    ): Promise<boolean> => {
      const active = latest.current;
      if (!active.form || active.prop === undefined) {
        callback?.(true);
        return true;
      }
      const key = pathKey(active.prop);
      const fromForm = active.form.props.rules?.[key];
      const all = [
        ...(fromForm ? (Array.isArray(fromForm) ? fromForm : [fromForm]) : []),
        ...(active.rules ? (Array.isArray(active.rules) ? active.rules : [active.rules]) : []),
      ].map((rule) => ({ ...rule }));
      if (active.required !== undefined) {
        let found = false;
        for (const rule of all)
          if ('required' in rule) {
            rule.required = active.required;
            found = true;
          }
        if (!found) all.push({ required: active.required });
      }
      const filtered = all.filter(
        (rule) =>
          !trigger ||
          !rule.trigger ||
          (Array.isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger),
      );
      if (!filtered.length) {
        callback?.(true);
        return true;
      }
      const request = ++sequence.current;
      setState({ status: 'validating', message: '' });
      try {
        const validator = new Schema({ [key]: filtered });
        await validator.validate(
          { [key]: override ? override.value : getFieldValue(active.form.model, active.prop) },
          { firstFields: true },
        );
        if (request === sequence.current) {
          setState({ status: 'success', message: '' });
          active.form.notify(active.prop, true, '');
        }
        callback?.(true);
        return true;
      } catch (caught) {
        const failure = caught as { errors?: Array<{ message?: string }>; fields?: ValidateFieldsError };
        const message = failure.errors?.[0]?.message ?? 'Validation failed';
        if (request === sequence.current) {
          setState({ status: 'error', message });
          active.form.notify(active.prop, false, message);
        }
        const fields = failure.fields ?? { [key]: [{ message, field: key }] };
        callback?.(false, fields);
        if (!callback) throw fields;
        return false;
      }
    },
    [],
  );
  /** 只重置当前字段。 */
  const resetField = useCallback(() => {
    const active = latest.current;
    if (active.form && active.prop !== undefined)
      active.form.setField(active.prop, cloneValue(initial.current));
    clearValidate();
  }, [clearValidate]);
  const stateRef = useRef(state);
  stateRef.current = {
    status: validateStatus ?? (error ? 'error' : state.status),
    message: error ?? state.message,
  };
  const sizeRef = useRef(actualSize);
  sizeRef.current = actualSize;
  const handle = useRef<FormItemHandle>({
    get prop() {
      return latest.current.prop;
    },
    get size() {
      return sizeRef.current;
    },
    get validateMessage() {
      return stateRef.current.message;
    },
    get validateState() {
      return stateRef.current.status;
    },
    validate,
    resetField,
    clearValidate,
    setInitialValue: (value) => {
      initial.current = cloneValue(value);
    },
  }).current;
  const key = prop === undefined ? undefined : pathKey(prop);
  const register = form?.register;
  useEffect(() => {
    if (key !== undefined && register)
      return register(key, {
        handle,
        node: () => node.current,
        getInitialValue: () => cloneValue(initial.current),
      });
  }, [key, register, handle]);
  useEffect(
    () => () => {
      sequence.current++;
    },
    [],
  );
  useImperativeHandle(ref, () => handle, [handle]);
  const position = labelPosition ?? form?.props.labelPosition ?? 'right';
  const width = labelWidth ?? form?.props.labelWidth;
  const message = error ?? state.message;
  const status = validateStatus ?? (error ? 'error' : state.status);
  const formRules = key ? form?.props.rules?.[key] : undefined;
  const isRequired =
    required ??
    [
      ...(formRules ? (Array.isArray(formRules) ? formRules : [formRules]) : []),
      ...(rules ? (Array.isArray(rules) ? rules : [rules]) : []),
    ].some((rule) => rule.required);
  const content =
    typeof children === 'function'
      ? children({
          value: form && prop !== undefined ? getFieldValue(form.model, prop) : undefined,
          setValue: (value) => {
            if (form && prop !== undefined) form.setField(prop, value);
          },
        })
      : children;
  return (
    <FormContext value={{ ...inherited, size: actualSize }}>
      <FieldValidationContext
        value={{
          change: (next) => {
            void validate('change', undefined, { value: next }).catch(() => undefined);
          },
          blur: () => {
            void validate('blur').catch(() => undefined);
          },
          errorId: `${id}-error`,
          invalid: status === 'error',
        }}
      >
        <div
          {...rest}
          ref={node}
          className={cx(
            ns.b,
            ns.m(actualSize),
            ns.m(`label-${position}`),
            ns.is('required', isRequired),
            ns.is('error', status === 'error'),
            ns.is('success', status === 'success'),
            ns.is('validating', status === 'validating'),
            form?.props.requireAsteriskPosition === 'right' ? 'asterisk-right' : 'asterisk-left',
            form?.props.hideRequiredAsterisk ? 'is-no-asterisk' : '',
            className,
          )}
          style={style}
        >
          {(label !== undefined || renderLabel !== undefined) && (
            <label
              id={`${id}-label`}
              htmlFor={htmlFor ?? inputId}
              className={ns.e('label')}
              style={{
                width: position === 'top' ? undefined : typeof width === 'number' ? `${width}px` : width,
              }}
            >
              {renderLabel ?? label}
              {form?.props.labelSuffix}
            </label>
          )}
          <div
            className={ns.e('content')}
            role={htmlFor || inputId ? undefined : 'group'}
            aria-labelledby={label !== undefined || renderLabel !== undefined ? `${id}-label` : undefined}
          >
            {content}
            {status === 'error' && message && (showMessage ?? form?.props.showMessage ?? true) && (
              <div
                role="alert"
                id={`${id}-error`}
                className={cx(
                  ns.e('error'),
                  (inlineMessage ?? form?.props.inlineMessage) && `${ns.e('error')}--inline`,
                )}
              >
                {renderError ? renderError({ error: message }) : message}
              </div>
            )}
          </div>
        </div>
      </FieldValidationContext>
    </FormContext>
  );
}
export type { FormPath };

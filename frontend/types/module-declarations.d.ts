// Module declarations for libraries without type definitions

// React
declare module 'react' {
  export * from 'react';
  export interface ReactNode {}
  export interface ReactElement {}
  export interface FC<P = {}> {
    (props: P): ReactElement | null;
  }
  export interface ChangeEvent<T = Element> {}
  export interface FocusEvent<T = Element> {}
  export interface FormEvent<T = Element> {}
  export interface SVGAttributes<T> {}
  export const createContext: any;
  export const useContext: any;
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useRef: any;
}

// Zod
declare module 'zod' {
  export const z: any;
  export const ZodType: any;
  export const ZodString: any;
  export const ZodNumber: any;
  export const ZodBoolean: any;
  export const ZodObject: any;
  export const ZodArray: any;
  export const ZodEnum: any;
  export const ZodDate: any;
  export const ZodOptional: any;
  export const ZodNullable: any;
  export const ZodUnion: any;
  export const ZodIntersection: any;
  export const ZodTuple: any;
  export const ZodRecord: any;
  export const ZodMap: any;
  export const ZodSet: any;
  export const ZodFunction: any;
  export const ZodPromise: any;
  export const ZodAny: any;
  export const ZodUnknown: any;
  export const ZodNever: any;
  export const ZodVoid: any;
  export const ZodUndefined: any;
  export const ZodNull: any;
  export const ZodLiteral: any;
  export function object(shape: any): any;
  export function string(): any;
  export function number(): any;
  export function boolean(): any;
  export function array(schema: any): any;
  export function enumType(values: any[]): any;
  export function date(): any;
  export function any(): any;
}

// React Hook Form
declare module 'react-hook-form' {
  export const useForm: any;
  export const useFormContext: any;
  export const FormProvider: any;
  export const Controller: any;
  export const useController: any;
  export const useWatch: any;
  export const useFieldArray: any;
  export const useFormState: any;
}

// Hookform Resolvers
declare module '@hookform/resolvers/zod' {
  export const zodResolver: any;
}

// Supabase
declare module '@supabase/supabase-js' {
  export const createClient: any;
  export const SupabaseClient: any;
}

declare module '@supabase/auth-helpers-nextjs' {
  export const createServerSupabaseClient: any;
}

declare module '@supabase/auth-helpers-react' {
  export const useSupabaseClient: any;
  export const useUser: any;
  export const useSession: any;
}

// Axios
declare module 'axios' {
  export const axios: any;
  export default axios;
}

// React Icons
declare module 'react-icons/*' {
  export const IconType: any;
}

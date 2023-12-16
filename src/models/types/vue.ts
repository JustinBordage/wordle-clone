import { ComputedRef, Ref } from "vue";

/** Use Vue's "toValue" function to unwrap this. */
export type RefOrGetter<T> = Ref<T> | ComputedRef<T> | (() => T);
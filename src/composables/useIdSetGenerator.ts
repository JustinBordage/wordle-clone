import { computed, toValue } from "vue";
import { nanoid } from "nanoid";
import { RefOrGetter } from "@/models/types/vue";

export function useIdSetGenerator(size: RefOrGetter<number>) {
	return computed(() => Array(toValue(size)).map(() => nanoid()));
}
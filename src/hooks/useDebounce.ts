import { ref, watch, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>;

  let timeout: number | undefined;

  const unwatch = watch(value, (newValue) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  onUnmounted(() => {
    clearTimeout(timeout);
    unwatch();
  });

  return debouncedValue;
}

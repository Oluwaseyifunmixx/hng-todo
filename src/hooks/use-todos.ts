import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTodo,
  deleteTodoPermanently,
  getTodos,
  restoreTodo,
  trashTodo,
  updateTodo,
  type TodoFilters,
} from "@/lib/api/todos";
import type { UpdateTodoInput } from "@/lib/validations/todo";

const TODOS_KEY = "todos";

export function useTodos(filters: TodoFilters) {
  return useQuery({
    queryKey: [TODOS_KEY, filters],
    queryFn: () => getTodos(filters),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateTodos() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
}

export function useCreateTodo() {
  const invalidateTodos = useInvalidateTodos();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => invalidateTodos(),
  });
}

export function useUpdateTodo() {
  const invalidateTodos = useInvalidateTodos();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      updateTodo(id, input),
    onSuccess: () => invalidateTodos(),
  });
}

export function useTrashTodo() {
  const invalidateTodos = useInvalidateTodos();

  return useMutation({
    mutationFn: trashTodo,
    onSuccess: () => invalidateTodos(),
  });
}

export function useRestoreTodo() {
  const invalidateTodos = useInvalidateTodos();

  return useMutation({
    mutationFn: restoreTodo,
    onSuccess: () => invalidateTodos(),
  });
}

export function useDeleteTodoPermanently() {
  const invalidateTodos = useInvalidateTodos();

  return useMutation({
    mutationFn: deleteTodoPermanently,
    onSuccess: () => invalidateTodos(),
  });
}
import { useEffect, useState } from 'react';
import { ITask } from './taskSchema';
import { TaskStatus } from './taskConst';
import { Error } from '../errors';

export type UseTaskStateResult<T> =
  {
    data: T;
    error: null;
    loading: false;
  } | {
    data: null;
    error: Error;
    loading: false;
  } | {
    data: null;
    error: null;
    loading: true
  };

export function useTask<T = any, TTask extends ITask<T> = ITask<T>>(
  factory: () => TTask)
  : TTask {

  const [task] = useState<TTask>(() => factory());

  useEffect(() => {
    task.run();
  }, [task]);

  return task;
}

export function useTaskState<T = any, TTask extends ITask<T> = ITask<T>>(
  factory: () => TTask)
  : UseTaskStateResult<T> {

  const task = useTask(factory);
  return getUseTaskStateResult(task);
}

/**
 * Returns the `UseTaskState` hook output object from the provided task.
 * Useful when you want to create other task based hooks and you don't want
 * to use `useTaskState` hook directly.
 * This method is also used internally by `useTaskState`.
 */
export function getUseTaskStateResult<
  T = any,
  TTask extends ITask<T> = ITask<T>>(
    task: TTask)
  : UseTaskStateResult<T> {

  switch (task.status) {
    default:
    case TaskStatus.Idle:
    case TaskStatus.Running:
      return {
        data: null,
        error: null,
        loading: true
      };

    case TaskStatus.Completed:
      return {
        data: task.value!,
        error: null,
        loading: false
      };

    case TaskStatus.Error:
      return {
        data: null,
        error: task.error!,
        loading: false
      }
  }
}
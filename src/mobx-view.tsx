import { useState, useEffect } from 'react';
import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

export class View<P = {}> {
  props!: P;

  onCreate?(): void;
  onMount?(): void | (() => void);

  ref<T extends HTMLElement = HTMLElement>(): { current: T | null } {
    return { current: null };
  }

  render?(): JSX.Element;
}

export function createView<P extends object, V extends View<P>>(
  ViewClass: new () => V,
  templateOrOptions?: ((vm: V) => JSX.Element) | { autoObservable?: boolean }
) {
  const template = typeof templateOrOptions === 'function' ? templateOrOptions : undefined;
  const options = typeof templateOrOptions === 'object' ? templateOrOptions : {};
  const { autoObservable = true } = options;

  return observer((props: P) => {
    const [vm] = useState(() => {
      const instance = new ViewClass();
      instance.props = props;

      if (autoObservable) {
        makeAutoObservable(instance, {
          props: observable.ref,
          render: false,
          onCreate: false,
          onMount: false,
          ref: false,
        }, { autoBind: true });
      } else {
        makeObservable(instance, {
          props: observable.ref,
        });
      }

      instance.onCreate?.();
      return instance;
    });

    runInAction(() => {
      vm.props = props;
    });

    useEffect(() => {
      return vm.onMount?.();
    }, []);

    return template ? template(vm) : vm.render!();
  });
}

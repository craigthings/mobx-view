/**
 * Global configuration options for mobx-mantle
 */
export interface MantleConfig {
  /** Whether to automatically make View/Behavior instances observable (default: true) */
  autoObservable?: boolean;
}

export const globalConfig: MantleConfig = {
  autoObservable: true,
};

/**
 * Configure global defaults for mobx-mantle.
 * Settings can still be overridden per-view in createView options.
 */
export function configure(config: MantleConfig): void {
  Object.assign(globalConfig, config);
}

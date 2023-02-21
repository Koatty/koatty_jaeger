/*
 * @Description:
 * @Usage:
 * @Author: xxx
 * @Date: 2020-12-24 10:32:14
 * @LastEditTime: 2023-02-21 17:35:14
 */
import { Logger } from "./logger";
import { Koatty, Helper } from "koatty";
import * as prometheus from "prom-client";
import { initTracer, PrometheusMetricsFactory, TracingConfig, TracingOptions } from "jaeger-client";

/**
 *
 *
 * @interface OptionsInterface
 */
interface OptionsInterface extends TracingConfig {
  Options?: TracingOptions;
}

/**
 * default options
 */
const defaultOptions: OptionsInterface = {
  // todo
  serviceName: 'my-awesome-service',
  sampler: {
    type: "const",
    param: 1,
  },
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    logSpans: true,
    collectorEndpoint: 'http://127.0.0.1:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
  Options: {
    // tags: {
    //   'my-awesome-service.version': '1.1.2',
    // },
  }
};

export async function KoattyJaeger(options: OptionsInterface, app: Koatty): Promise<any> {
  // todo
  const config = { ...defaultOptions, ...options };

  config.Options.logger = Logger;
  if (!config.Options.metrics) {
    const metrics = new PrometheusMetricsFactory(prometheus, app.name);
    config.Options.metrics = metrics;
  }
  if (!config.Options.logger) {
    config.Options.logger = Logger;
  }

  const tracer = await initTracer(config, config.Options);
  app.setMetaData("tracer", tracer);

  return Promise.resolve();
}
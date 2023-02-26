/*
 * @Description:
 * @Usage:
 * @Author: xxx
 * @Date: 2020-12-24 10:32:14
 * @LastEditTime: 2023-02-26 21:43:01
 */
import { Koatty, Helper, Logger } from "koatty";
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
  serviceName: 'unknownKoattyProject',
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    // logSpans: true,
    // collectorEndpoint: 'http://127.0.0.1:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
  Options: {
    tags: {},
  }
};

export async function KoattyJaeger(options: OptionsInterface, app: Koatty): Promise<any> {
  // todo
  const config = { ...defaultOptions, ...options };

  if (!config.Options.metrics) {
    const metrics = new PrometheusMetricsFactory(prometheus, config.serviceName);
    config.Options.metrics = metrics;
  }
  if (!config.Options.logger) {
    config.Options.logger = Logger;
  }
  config.Options.tags[`${config.serviceName}-version`] = app.version;

  const tracer = await initTracer(config, config.Options);
  app.setMetaData("tracer", tracer);

  return Promise.resolve();
}
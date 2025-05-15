import { diag, DiagLogLevel, DiagConsoleLogger } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

// This is a temporary fix to avoid the error "No registered SpanProcessor"
const sdk = new NodeSDK({
    serviceName: 'chat-service',
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        compression: 'gzip',
    }),
    instrumentations: [
        new HttpInstrumentation(),
    ],
});

process.on('beforeExit', async () => {
    await sdk.shutdown();
});

export const initTracing = async () => {
    return sdk.start()
}
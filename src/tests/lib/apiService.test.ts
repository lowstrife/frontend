import { describe, it, expect, beforeAll } from "vitest";
import { z } from "zod";
import { apiService } from "@/lib/apiService";
import AxiosMockAdapter from "axios-mock-adapter";
import axiosSetup from "@/util/axiosSetup";
import { createPinia, setActivePinia } from "pinia";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("ApiService", () => {
	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	describe("setup", () => {
		it("service defined", () => {
			expect(apiService).toBeDefined();
			expect(apiService.get).toBeDefined();
			expect(apiService.post).toBeDefined();
		});
	});

	describe("error normalization", async () => {
		it("get: wrong response schema", async () => {
			const mockDataWrong = { foo: "moo" };
			const responseSchema = z.object({ id: z.number(), name: z.string() });
			type responseType = z.infer<typeof responseSchema>;

			mock.onGet("/test").reply(200, mockDataWrong);

			await expect(
				apiService.get<responseType>("/test", responseSchema)
			).rejects.toThrowError(
				/^Validation error: Required: id, Required: name$/
			);
		});

		it("post: generic error", async () => {
			const mockPayload = { foo: "moo" };
			const payloadSchema = z.object({ foo: z.string() });
			type payloadType = z.infer<typeof payloadSchema>;

			const responseSchema = z.object({ moo: z.string() });
			type responseType = z.infer<typeof responseSchema>;

			mock.onPost("/test").timeout();

			await expect(
				apiService.post<payloadType, responseType>(
					"/test",
					mockPayload,
					payloadSchema,
					responseSchema,
					true
				)
			).rejects.toThrowError(/^HTTP undefined: timeout of 0ms exceeded$/);
		});

		it("axios error", async () => {
			const responseSchema = z.object({ id: z.number(), name: z.string() });
			type responseType = z.infer<typeof responseSchema>;

			mock.onGet("/test").timeout();

			await expect(
				apiService.get<responseType>("/test", responseSchema)
			).rejects.toThrowError(/^HTTP undefined: timeout of 0ms exceeded$/);
		});
	});

	describe("get", async () => {
		it("successful call and response parsing", async () => {
			const mockData = { id: 1, name: "Test" };
			const responseSchema = z.object({ id: z.number(), name: z.string() });
			type responseType = z.infer<typeof responseSchema>;

			mock.onGet("/test").reply(200, mockData);

			const result = await apiService.get<responseType>(
				"/test",
				responseSchema
			);
			expect(result).toStrictEqual(mockData);
		});
	});

	describe("post", async () => {
		it("successfull call and reponse parsing", async () => {
			const mockPayload = { foo: "moo" };
			const payloadSchema = z.object({ foo: z.string() });
			type payloadType = z.infer<typeof payloadSchema>;

			const mockResponse = { moo: "foo" };
			const responseSchema = z.object({ moo: z.string() });
			type responseType = z.infer<typeof responseSchema>;

			mock.onPost("/test").reply(200, mockResponse);

			const result = await apiService.post<payloadType, responseType>(
				"/test",
				mockPayload,
				payloadSchema,
				responseSchema
			);

			expect(result).toStrictEqual(mockResponse);
		});
	});
});

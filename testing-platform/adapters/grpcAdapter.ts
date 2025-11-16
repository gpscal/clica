import { AccountServiceClient } from "@clica-grpc/account"
import { BrowserServiceClient } from "@clica-grpc/browser"
import { CheckpointsServiceClient } from "@clica-grpc/checkpoints"
import { CommandsServiceClient } from "@clica-grpc/commands"
import { FileServiceClient } from "@clica-grpc/file"
import { McpServiceClient } from "@clica-grpc/mcp"
import { ModelsServiceClient } from "@clica-grpc/models"
import { SlashServiceClient } from "@clica-grpc/slash"
import { StateServiceClient } from "@clica-grpc/state"
import { TaskServiceClient } from "@clica-grpc/task"
import { UiServiceClient } from "@clica-grpc/ui"
import { WebServiceClient } from "@clica-grpc/web"
import { credentials } from "@grpc/grpc-js"
import { promisify } from "util"

const serviceRegistry = {
	"clica.AccountService": AccountServiceClient,
	"clica.BrowserService": BrowserServiceClient,
	"clica.CheckpointsService": CheckpointsServiceClient,
	"clica.CommandsService": CommandsServiceClient,
	"clica.FileService": FileServiceClient,
	"clica.McpService": McpServiceClient,
	"clica.ModelsService": ModelsServiceClient,
	"clica.SlashService": SlashServiceClient,
	"clica.StateService": StateServiceClient,
	"clica.TaskService": TaskServiceClient,
	"clica.UiService": UiServiceClient,
	"clica.WebService": WebServiceClient,
} as const

export type ServiceClients = {
	-readonly [K in keyof typeof serviceRegistry]: InstanceType<(typeof serviceRegistry)[K]>
}

export class GrpcAdapter {
	private clients: Partial<ServiceClients> = {}

	constructor(address: string) {
		for (const [name, Client] of Object.entries(serviceRegistry)) {
			this.clients[name as keyof ServiceClients] = new (Client as any)(address, credentials.createInsecure())
		}
	}

	async call(service: keyof ServiceClients, method: string, request: any): Promise<any> {
		const client = this.clients[service]
		if (!client) {
			throw new Error(`No gRPC client registered for service: ${String(service)}`)
		}

		const fn = (client as any)[method]
		if (typeof fn !== "function") {
			throw new Error(`Method ${method} not found on service ${String(service)}`)
		}

		try {
			const fnAsync = promisify(fn).bind(client)
			const response = await fnAsync(request.message)
			return response?.toObject ? response.toObject() : response
		} catch (error) {
			console.error(`[GrpcAdapter] ${service}.${method} failed:`, error)
			throw error
		}
	}

	close(): void {
		for (const client of Object.values(this.clients)) {
			if (client && typeof (client as any).close === "function") {
				;(client as any).close()
			}
		}
	}
}

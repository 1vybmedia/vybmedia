import { Controller, Get } from "@nestjs/common";
import { ApiHealthResponse } from "@vyb/shared";

@Controller("health")
export class HealthController {
  @Get()
  getHealth(): ApiHealthResponse {
    return {
      ok: true,
      service: "api",
      checkedAt: new Date().toISOString()
    };
  }
}

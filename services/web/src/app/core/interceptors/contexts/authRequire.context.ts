import { HttpContextToken } from "@angular/common/http";

export const REQUIRE_AUTH = new HttpContextToken<boolean>(() => false);

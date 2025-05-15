import { HttpContextToken } from "@angular/common/http";

export const BLOCK_REQUIRE = new HttpContextToken<boolean>(() => true);

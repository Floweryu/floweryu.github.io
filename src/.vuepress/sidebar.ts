import { sidebar } from "vuepress-theme-hope";
import { java } from "./sidebar/java.ts";
import { redis } from "./sidebar/redis.ts";
import { algorithm } from "./sidebar/algorithm.ts";
import { mysql } from "./sidebar/mysql.ts";
import { dubbo } from "./sidebar/dubbo.ts";
import { rocketmq } from "./sidebar/rocketmq.ts";
import { sentinel } from "./sidebar/sentinel.ts";
import { spring } from "./sidebar/spring.ts";
import { idea } from "./sidebar/idea.ts";

export default sidebar({
  "/java/": java,
  "/redis/": redis,
  "/algorithm/": algorithm,
  "/mysql/": mysql,
  "/dubbo/": dubbo,
  "/rocketmq/": rocketmq,
  "/sentinel/": sentinel,
  "/spring/": spring,
  "/distributed/": idea
});

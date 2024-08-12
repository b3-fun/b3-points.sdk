import { listApps, registerApp } from "./appRegistry";
import {
  aggregateAppPoints,
  aggregateUserPoints,
  getAppAvailablePoints,
  getTotalAppPoints,
  getTotalUserPoints,
  grantPoints,
  transferPoints,
} from "./bps";

async function main(): Promise<void> {
  // await registerApp().then((res) => console.log("registerApp:", res));
  await listApps().then((apps) => {
    console.log("listApps:", apps);
  });

  // await grantPoints().then((res) => console.log("grantPoints:", res));
  await getTotalAppPoints().then((res) =>
    console.log("getTotalAppPoints:", res),
  );
  await getAppAvailablePoints().then((res) =>
    console.log("getAppAvailablePoints:", res),
  );
  await aggregateAppPoints().then((res) =>
    console.log("aggregateAppPoints:", res),
  );

  // await transferPoints().then((res) => console.log("transferPoints:", res));
  await getTotalUserPoints().then((res) =>
    console.log("getTotalUserPoints:", res),
  );
  await aggregateUserPoints().then((res) =>
    console.log("aggregateUserPoints:", res),
  );
}

void main();

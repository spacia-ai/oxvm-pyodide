import { afterAll, beforeAll, expect, it } from "vitest";
import { startGuest } from "./support/guest-fixture.ts";
import type { GuestFixture } from "./support/guest-fixture.ts";

let guest: GuestFixture;
beforeAll(async () => { guest = await startGuest(); });
afterAll(async () => { await guest.stop(); await guest.dispose(); });

it("shares one Python API between the canonical name and the supported legacy name", async () => {
  const result = await guest.run(`
import oxvm, oxidevm
print(oxvm.run(["/bin/true"]).returncode)
print(oxvm.run is oxidevm.run, oxvm.Connection is oxidevm.Connection)
print(oxvm.__all__ == oxidevm.__all__)
print(oxvm.__file__.endswith("/oxvm.py"), oxidevm.__file__.endswith("/oxidevm.py"))
`);
  expect(result.stderr).toBe("");
  expect(result.status).toBe(0);
  expect(result.stdout).toBe("0\nTrue True\nTrue\nTrue True\n");
  expect(guest.process.spawned).toHaveLength(1);
});

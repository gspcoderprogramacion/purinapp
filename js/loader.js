import { requireAuth } from "./authSesion.js";
import { validateRole } from "./authPermiso.js";

requireAuth((user) => {
  validateRole(user);
});
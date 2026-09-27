"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";
import { adminRequest } from "./api";
import { Badge, Button, Field, inputClass } from "./ui";

type User = { id: string; name: string; email: string; role: AdminRole; active: boolean };
const roleLabel = (r: string) => r.charAt(0).toUpperCase() + r.slice(1);

export function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<AdminRole>(user.role);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<{ busy: boolean; error: string | null; message: string | null }>({ busy: false, error: null, message: null });

  async function patch(body: Record<string, unknown>, message: string) {
    setState({ busy: true, error: null, message: null });
    const res = await adminRequest(`/api/admin/users/${user.id}`, "PATCH", body);
    if (!res.ok) return setState({ busy: false, error: res.error, message: null });
    setState({ busy: false, error: null, message });
    router.refresh();
    return true;
  }

  const dirty = name.trim() !== user.name || role !== user.role;

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-nordic">{user.name}</span>
        {isSelf && <Badge tone="info">You</Badge>}
        {!user.active && <Badge tone="danger">Deactivated</Badge>}
        <span className="text-sm text-ink/60">{user.email}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <Field label="Name" htmlFor={`u-name-${user.id}`}>
          <input id={`u-name-${user.id}`} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Role" htmlFor={`u-role-${user.id}`}>
          <select
            id={`u-role-${user.id}`}
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            disabled={isSelf}
            title={isSelf ? "You cannot change your own role" : undefined}
            className={inputClass}
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </select>
        </Field>
        <Button
          variant="primary"
          disabled={!dirty || state.busy}
          onClick={() => patch({ ...(name.trim() !== user.name ? { name } : {}), ...(role !== user.role ? { role } : {}) }, "Saved.")}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => setShowPassword((s) => !s)} aria-expanded={showPassword}>
          Reset password
        </Button>
        {!isSelf && (
          <Button
            variant={user.active ? "danger" : "secondary"}
            disabled={state.busy}
            onClick={() => {
              if (user.active && !window.confirm(`Deactivate ${user.name}? They will not be able to sign in.`)) return;
              patch({ active: !user.active }, user.active ? "Deactivated." : "Reactivated.");
            }}
          >
            {user.active ? "Deactivate" : "Reactivate"}
          </Button>
        )}
      </div>
      {showPassword && (
        <form
          className="mt-3 flex flex-wrap items-end gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (await patch({ password }, "Password updated. Share it with the user securely.")) {
              setPassword("");
              setShowPassword(false);
            }
          }}
        >
          <Field label="New password" htmlFor={`u-pw-${user.id}`} hint="At least 10 characters.">
            <input
              id={`u-pw-${user.id}`}
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Button type="submit" disabled={state.busy}>
            Set password
          </Button>
        </form>
      )}
      {state.error && (
        <p role="alert" className="mt-2 text-sm font-bold text-clay">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="mt-2 text-sm text-nordic">
          {state.message}
        </p>
      )}
    </li>
  );
}

export function UserCreateForm() {
  const router = useRouter();
  const empty = { name: "", email: "", role: "staff" as AdminRole, password: "" };
  const [v, setV] = useState(empty);
  const [state, setState] = useState<{ busy: boolean; error: string | null; message: string | null }>({ busy: false, error: null, message: null });

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ busy: true, error: null, message: null });
        const res = await adminRequest("/api/admin/users", "POST", v);
        if (!res.ok) return setState({ busy: false, error: res.error, message: null });
        setState({ busy: false, error: null, message: `Added ${v.name}.` });
        setV(empty);
        router.refresh();
      }}
    >
      <Field label="Name" htmlFor="nu-name">
        <input id="nu-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} required className={inputClass} />
      </Field>
      <Field label="Email" htmlFor="nu-email">
        <input id="nu-email" type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} required className={inputClass} />
      </Field>
      <Field label="Role" htmlFor="nu-role">
        <select id="nu-role" value={v.role} onChange={(e) => setV({ ...v, role: e.target.value as AdminRole })} className={inputClass}>
          {ADMIN_ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabel(r)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Initial password" htmlFor="nu-pw" hint="At least 10 characters. Share it securely; ask them to keep it private.">
        <input
          id="nu-pw"
          type="password"
          autoComplete="new-password"
          minLength={10}
          value={v.password}
          onChange={(e) => setV({ ...v, password: e.target.value })}
          required
          className={inputClass}
        />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm font-bold text-clay">
          {state.error}
        </p>
      )}
      {state.message && (
        <p role="status" className="text-sm text-nordic">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={state.busy}>
        {state.busy ? "Adding…" : "Add user"}
      </Button>
    </form>
  );
}

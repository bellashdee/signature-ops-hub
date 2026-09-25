"use client";

import { useState, useTransition } from "react";
import { addMember, updateMember, deleteMember, type Member } from "@/lib/members-actions";
import { IconEye, IconEyeOff } from "@/components/icons";

function PasswordInput({ id, name }: { id: string; name: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center rounded-lg border border-line bg-paper-raised pr-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        autoComplete="new-password"
        className="w-full bg-transparent px-3 py-2 text-sm text-ink outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="shrink-0 rounded-md p-1.5 text-ink-muted transition hover:text-ink"
      >
        {show ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function MembersManager({ initialMembers, currentUserId }: { initialMembers: Member[]; currentUserId: string }) {
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function refreshFromServer() {
    // Server actions already revalidatePath; a full reload keeps this component simple.
    window.location.reload();
  }

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addMember({
        loginId: String(formData.get("loginId") ?? ""),
        password: String(formData.get("password") ?? ""),
        displayName: String(formData.get("displayName") ?? ""),
        role: (formData.get("role") as "admin" | "user") ?? "user",
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setShowAddForm(false);
      refreshFromServer();
    });
  }

  function handleUpdate(id: string, formData: FormData) {
    setError(null);
    const password = String(formData.get("password") ?? "");
    startTransition(async () => {
      const result = await updateMember(id, {
        displayName: String(formData.get("displayName") ?? ""),
        role: (formData.get("role") as "admin" | "user") ?? "user",
        ...(password ? { password } : {}),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      refreshFromServer();
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteMember(id);
      if (!result.ok) {
        setError(result.error);
        setConfirmingId(null);
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setConfirmingId(null);
    });
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm font-medium text-negative">{error}</p>}

      <div className="card divide-y divide-line">
        {members.map((member) => (
          <div key={member.id} className="p-5">
            {editingId === member.id ? (
              <form
                action={(fd) => handleUpdate(member.id, fd)}
                className="space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-ink-muted">Display name</label>
                    <input
                      name="displayName"
                      defaultValue={member.displayName ?? ""}
                      className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink-muted">Role</label>
                    <select
                      name="role"
                      defaultValue={member.role}
                      className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-muted">
                    New password <span className="font-normal">(leave blank to keep current)</span>
                  </label>
                  <div className="mt-1">
                    <PasswordInput id={`password-${member.id}`} name="password" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {member.displayName || member.loginId}
                    {member.id === currentUserId && <span className="text-ink-muted"> (you)</span>}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {member.loginId} ·{" "}
                    <span className={member.role === "admin" ? "font-medium text-accent" : ""}>
                      {member.role === "admin" ? "Admin" : "User"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {confirmingId === member.id ? (
                    <>
                      <span className="text-sm text-ink-muted">Remove this member?</span>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={isPending}
                        className="rounded-lg bg-negative px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                      >
                        {isPending ? "Removing…" : "Yes, remove"}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(member.id)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper"
                      >
                        Edit
                      </button>
                      {member.id !== currentUserId && (
                        <button
                          onClick={() => setConfirmingId(member.id)}
                          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-negative hover:bg-negative-soft"
                        >
                          Remove
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        {showAddForm ? (
          <form action={handleAdd} className="card space-y-3 p-5">
            <h3 className="font-display text-base font-semibold text-ink">Add a member</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink-muted">
                  Username <span className="font-normal">(or email, for admins)</span>
                </label>
                <input
                  name="loginId"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Display name</label>
                <input
                  name="displayName"
                  className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-ink-muted">Password</label>
                <div className="mt-1">
                  <PasswordInput id="new-password" name="password" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted">Role</label>
                <select
                  name="role"
                  defaultValue="user"
                  className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Adding…" : "Add member"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-sm transition hover:opacity-90"
          >
            + Add member
          </button>
        )}
      </div>
    </div>
  );
}

import { $fetch } from "ohmyfetch";
import { useState } from "preact/hooks";
import { useSWRConfig } from "swr";
import { useLocation } from "wouter-preact";
import type { Note, Response } from "../../server/types";
import { Button } from "../components/Button";
import { Select } from "../components/Select";
import { Textarea } from "../components/Textarea";
import { encryptData } from "../encryption";
import { useNotesHistoryStore } from "../stores/useNotesHistoryStore";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const expirationTimes: { label: string; value: number }[] = [
	{ label: "Never", value: 0 },
	{ label: "15 Minutes", value: 15 * MINUTE },
	{ label: "1 Hour", value: HOUR },
	{ label: "1 Day", value: DAY },
	{ label: "1 Week", value: 7 * DAY },
	{ label: "1 Month", value: 30 * DAY },
	{ label: "1 Year", value: 365 * DAY },
];

export function HomePage() {
	const store = useNotesHistoryStore();
	const [, setLocation] = useLocation();
	const { mutate } = useSWRConfig();

	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: Omit<SubmitEvent, "submitter">) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const text = formData.get("text") as string;
		const expirationTimeSeconds =
			(+formData.get("expirationTimeSeconds")! as number) || null;

		if (!text) {
			return;
		}

		setIsSubmitting(true);

		const encrypted = await encryptData(text);

		const response = await $fetch<Response<Note>>("/api/notes", {
			method: "POST",
			body: { text: encrypted.encrypted, expirationTimeSeconds },
		});
		const { data: note } = response;

		await mutate<Response<Note>>(`/api/notes/${note.id}`, response, {
			revalidate: false,
		});

		store.addNote({
			key: encrypted.objectKey,
			id: note.id,
			createdAt: note.createdAt,
			expiresAt: note.expiresAt,
		});

		setLocation(`/${note.id}#${encrypted.objectKey}`);
	}

	return (
		<form
			className="flex flex-col flex-grow gap-2"
			onSubmit={handleSubmit}
			disabled={isSubmitting}
		>
			<div className="flex gap-2">
				<Button type="submit" isLoading={isSubmitting}>
					Save
				</Button>
				<label className="flex items-center gap-2 ml-auto">
					Expires
					<Select name="expirationTimeSeconds">
						{expirationTimes.map(({ label, value }) => (
							<option value={value} key={value}>
								{label}
							</option>
						))}
					</Select>
				</label>
			</div>
			<Textarea
				className="w-full flex-grow"
				name="text"
				required
				maxLength={20000}
				autofocus
				onKeyDown={e => {
					if (e.ctrlKey && e.key === "s") {
						e.preventDefault();
						e.currentTarget.form?.requestSubmit();
					}
				}}
				disabled={isSubmitting}
			/>
		</form>
	);
}

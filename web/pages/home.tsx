import { $fetch } from "ohmyfetch";
import { useState } from "preact/hooks";
import { useSWRConfig } from "swr";
import { useLocation } from "wouter-preact";
import type { Note, Response } from "../../server/types";
import { Button } from "../components/Button";
import { Textarea } from "../components/Textarea";
import { encryptData } from "../encryption";

export function HomePage() {
	const [, setLocation] = useLocation();
	const { mutate } = useSWRConfig();

	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: Omit<SubmitEvent, "submitter">) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const text = formData.get("text") as string;

		if (!text) {
			return;
		}

		setIsSubmitting(true);

		const encrypted = await encryptData(text);

		const response = await $fetch<Response<Note>>("/api/notes", {
			method: "POST",
			body: { text: encrypted.encrypted },
		});
		const { data: note } = response;

		await mutate<Response<Note>>(`/api/notes/${note.id}`, response, {
			revalidate: false,
		});

		setLocation(`/${note.id}#${encrypted.objectKey}`);
	}

	return (
		<form
			className="flex flex-col flex-grow items-center gap-2"
			onSubmit={handleSubmit}
			disabled={isSubmitting}
		>
			<Button type="submit" isLoading={isSubmitting}>
				Save
			</Button>
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

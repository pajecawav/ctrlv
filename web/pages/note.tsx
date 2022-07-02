import { $fetch, FetchError } from "ohmyfetch";
import { QRCodeCanvas } from "qrcode.react";
import useSWR from "swr";
import type { Note, Response } from "../../server/types";
import { IconButton } from "../components/IconButton";
import { QrCodeIcon } from "../components/icons/QrCodeIcon";
import { Spinner } from "../components/Spinner";
import { Textarea } from "../components/Textarea";
import { decryptData } from "../encryption";
import { useHashLocation } from "../hooks/useHashLocation";
import { useTheme } from "../hooks/useTheme";
import { cn, formatCreatedDate, formatRelativeTime } from "../utils";

interface NotePageProps {
	id: string;
}

export function NotePage({ id }: NotePageProps) {
	const hash = useHashLocation();
	const { theme } = useTheme();

	const {
		data,
		isValidating,
		error: apiError,
	} = useSWR<Response<Note>, FetchError>(
		`/api/notes/${id}#${hash}`,
		async () => {
			const response = await $fetch<Response<Note>>(`/api/notes/${id}`);

			if (!hash) {
				throw new Error("Encryption key is missing in URL");
			}

			try {
				response.data.text = await decryptData(
					response.data.text,
					hash
				);
			} catch (e) {
				console.error(e);
				throw new Error("Failed to decrypt data");
			}

			return response;
		},
		{ revalidateIfStale: false }
	);

	const text = data?.data.text;
	const error = apiError?.response?.statusText || apiError?.message;

	const zinc300 = "#d4d4d8";
	const zinc800 = "#27272a";
	const qrCodeBg = theme === "light" ? "#ffffff" : zinc800;
	const qrCodeFg = theme === "light" ? "#000000" : zinc300;

	return (
		<div className="flex flex-col flex-grow gap-2">
			{error && <div className="text-red-400 mx-auto">{error}</div>}

			{data && (
				<div className="flex items-center gap-2">
					<details className="relative">
						<IconButton
							className="text-xl list-none cursor-pointer"
							as="summary"
						>
							<QrCodeIcon />
						</IconButton>
						<div
							className={cn(
								"absolute z-10 top-full left-0 mt-1 p-4 shadow-xl rounded-md",
								"border border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700"
							)}
						>
							<QRCodeCanvas
								value={window.location.href}
								size={192}
								className="rounded-md overflow-hidden"
								bgColor={qrCodeBg}
								fgColor={qrCodeFg}
							/>
						</div>
					</details>

					<div title={new Date(data.data.createdAt).toLocaleString()}>
						Created {formatCreatedDate(data.data.createdAt)}
					</div>

					{data.data.expiresAt && (
						<div
							className="ml-auto"
							title={new Date(
								data.data.expiresAt
							).toLocaleString()}
						>
							Expires {formatRelativeTime(data.data.expiresAt)}
						</div>
					)}
				</div>
			)}

			<div className="relative flex-grow flex">
				<Textarea
					className="flex-grow"
					disabled={true}
					value={text ?? ""}
				/>
				{!text && (
					<span className="absolute inset-0 grid place-items-center bg-zinc-200/50 dark:bg-zinc-700/50">
						<Spinner />
					</span>
				)}
			</div>
		</div>
	);
}

'use client';

import { generateChatResponse } from "@/utils/action";
import { getUserMessages, saveUserMessages } from "@/utils/dbutils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { GiRearAura } from "react-icons/gi";
import toast from 'react-hot-toast';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
	table: ({ node, ...props }) => (
		<table className="table-auto">{props.children}</table>
	),
	tbody: ({ node, ...props }) => (
		<tbody className="divide-y divide-gray-300">{props.children}</tbody>
	),
	tr: ({ node, ...props }) => (
		<tr className="border-b border-gray-300">{props.children}</tr>
	),
	th: ({ node, ...props }) => (
		<th className="px-4 py-2 text-left ">{props.children}</th>
	),
	td: ({ node, ...props }) => (
		<td className="px-4 py-2">{props.children}</td>
	),
};


const Chat = () => {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState([]);

	// Fetch user messages on component mount
	const { data: initialMessages, isLoading, isError } = useQuery({
		queryKey: ['userMessages'],
		queryFn: getUserMessages,
		onSuccess: (data) => setMessages(data),
	});
	useEffect(() => {
		if (initialMessages) {
			setMessages(initialMessages);
		}
	}, [initialMessages]);
	const { mutate, isPending } = useMutation({
		mutationFn: (query) => generateChatResponse([...messages, query]),
		onSuccess: (data) => {
			if (!data) {
				toast.error("Failed to generate response");
			}
			const updatedMessages = [...messages, data];
			setMessages(updatedMessages);
			saveUserMessages(updatedMessages);
		}
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		const query = { role: "user", content: text };
		mutate(query);
		setMessages((prev) => [...prev, query]);
		setText("");
	};

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading messages</div>;
	return (
		<div className="min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]">
			<div>
				{messages.map(({ role, content }, index) => {
					const avatar = role === "user" ? <FaUserGraduate className="h-6 w-6 text-primary" /> : <GiRearAura className="h-8 w-8 text-primary" />;
					const bgColor = role === "user" ? "bg-base-200" : "bg-base-100";
					return <div key={index} className={`${bgColor} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300 items-center`}>
						<span className="mr-4">{avatar}</span>
						<div className="max-w-3xl"><Markdown remarkPlugins={[remarkGfm]} components={components}>{content}</Markdown></div>
					</div>
				})}
				{isPending ? <span className="loading"></span> : null}
			</div>
			<form onSubmit={handleSubmit} className="max-w-4xl pt-12">
				<div className="join w-full">
					<input type="text" placeholder="Ask UoL Oracle" className="input input-bordered join-item w-full" value={text} required onChange={(e) => setText(e.target.value)} />
					<button className="btn btn-primary join-item" type="submit" disabled={isPending}>
						{isPending ? 'Loading...' : 'Ask Question'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;

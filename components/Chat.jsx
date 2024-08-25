'use client';

import { generateChatResponse } from "@/utils/action";
import { fetchCreditsByUserId, getUserInfo, getUserMessages, saveUserMessages, updateCredits } from "@/utils/dbutils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { GiRearAura } from "react-icons/gi";
import toast, { Toaster } from 'react-hot-toast';
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
	const [userId, setUserId] = useState("");
	const chatEndRef = useRef(null);
	// Fetch user messages on component mount
	const { data: initialMessages, isLoading } = useQuery({
		queryKey: ['userMessages'],
		queryFn: getUserMessages,
		onSuccess: (data) => setMessages(data),
	});

	const { data: user } = useQuery({
		queryKey: ['userInfo'],
		queryFn: getUserInfo,
		onSuccess: (data) => setUserId(data),
	});

	useEffect(() => {
		if (initialMessages) {
			setMessages(initialMessages);
		}
	}, [initialMessages]);

	useEffect(() => {
		if (user) {
			setUserId(user);
		}
	}, [user]);
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const { mutate, isPending } = useMutation({
		mutationFn: async (query) => {
			const credits = await fetchCreditsByUserId(userId);
			if (credits < 1000) {
				toast.error("Insufficient credits to ask question");
				return;
			}
			const response = await generateChatResponse([...messages, query]);
			if (!response) {
				toast.error("Failed to generate response");
				return;
			}

			const updatedMessages = [...messages, response.message];
			setMessages(updatedMessages);
			saveUserMessages(updatedMessages);

			const newCredits = await updateCredits(userId, response.credits);
			toast.success(`Question asked successfully. Remaining credits: ${newCredits}`, { duration: 5000 });
		},
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		const query = { role: "user", content: text };
		mutate(query);
		setMessages((prev) => [...prev, query]);
		setText("");
	};

	if (isLoading) return <div>Loading...</div>;
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
				<Toaster />
				<div ref={chatEndRef} />
				{isPending ? <span className="loading"></span> : null}
			</div>

			<form onSubmit={handleSubmit} className="sticky w-full bottom-6 max-w-5xl pt-12">
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

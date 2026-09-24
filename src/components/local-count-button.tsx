import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function LocalCountButton() {
	return (
		<ClientOnly>
			<ClientSection />
		</ClientOnly>
	);
}

function ClientSection() {
	const [count, setCount] = useState(loadCount);

	useEffect(() => {
		localStorage.setItem("count", count.toString());
	}, [count]);

	return (
		<Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
			{count}
		</Button>
	);
}

function loadCount() {
	const storedCount = localStorage.getItem("count");
	return storedCount ? parseInt(storedCount, 10) : 0;
}

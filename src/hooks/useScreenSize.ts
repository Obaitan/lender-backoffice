"use client";

import { useState, useEffect } from "react";

export const useScreenSize = () => {
	// Use a more conservative default for SSR (assume mobile first)
	const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		// This runs only on client-side
		setIsClient(true);
		setScreenSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return isClient ? screenSize : { width: 0, height: 0 };
};

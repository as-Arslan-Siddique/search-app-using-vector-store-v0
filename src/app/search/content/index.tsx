"use client";
import React, { useState, useEffect } from "react";
import { TextareaWithButton } from "@/components/ui/textarea";
import { Icons } from "@/components/ui/icons"; // Assuming you have a Spinner component

export function SearchComponent() {
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle search every 7 keystrokes
  useEffect(() => {
    if (keystrokeCount >= 7) {
      if (message.trim()) {
        performSearch(message);
      }
      setKeystrokeCount(0); // Reset the keystroke count after search
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keystrokeCount]);

  const handleKeyPress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setKeystrokeCount((prevCount) => prevCount + 1);
  };

  // Function to perform the search API call
  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pinecone/query_vector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_content: query,
          top_k: 5, // Adjust as needed
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(`Error: ${error.error}`);
      } else {
        const result = await response.json();
        setResults(result.retrievedData || []);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Search Bar */}
      <h1 className="font-extrabold text-4xl mb-4">Search</h1>
      <div className="flex items-center justify-center w-full">
        <div className="md:w-[700px] w-full max-w-screen-md bg-background p-2 rounded-[2rem] shadow-lg">
          <TextareaWithButton
            id="text"
            placeholder="Search something..."
            value={message}
            onChange={handleKeyPress}
            required
            autoComplete="off"
            className="w-full p-2"
            rows={1}
            onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`; // Dynamic height adjustment
            }}
          />
        </div>
      </div>

      {/* Results section */}
      <div className="mt-8 max-w-screen-lg p-4 max-h-96 overflow-y-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Icons.spinner className="h-4 w-4 animate-spin" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h2 className="font-bold text-xl">
                  {result.title || "Untitled"}
                </h2>
                <p className="text-gray-700 mt-2">
                  {result.content || "No content available."}
                </p>
                {/* Display additional metadata if available */}
                {result.author && (
                  <div className="flex flex-row gap-2 mt-1">
                    <p>Author:</p>
                    <p className="text-muted-foreground">{result.author}</p>
                  </div>
                )}
                {result.date && (
                  <div className="flex flex-row gap-2 mt-1">
                    <p>Date:</p>
                    <p className="text-muted-foreground">{result.date}</p>
                  </div>
                )}
                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-row gap-2 mt-1">
                    <p>Tags:</p>
                    <p className="text-muted-foreground">
                      {result.tags.join(", ")}
                    </p>
                  </div>
                )}
                {result.categories && result.categories.length > 0 && (
                  <div className="flex flex-row gap-2 mt-1">
                    <p>Categories:</p>
                    <p className="text-muted-foreground">
                      {result.categories.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No results yet...</p>
        )}
      </div>
    </main>
  );
}

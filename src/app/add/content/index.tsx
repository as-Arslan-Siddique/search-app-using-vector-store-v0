"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { format } from "date-fns"; // For formatting dates
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Icons } from "@/components/ui/icons";

export function AddComponent() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New state variables for metadata
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to send
    const data = {
      title: title,
      vector: content,
      metadata: {
        author,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated string to array
        categories: categories.split(",").map((cat) => cat.trim()),
        content: content,
        date,
      },
    };

    try {
      setIsLoading(true);
      const response = await fetch("/api/pinecone/insert_vector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(`Error: ${error.error}`);
      } else {
        const result = await response.json();
        setIsLoading(false);
        // Reset form fields
        setTitle("");
        setContent("");
        setAuthor("");
        setTags("");
        setCategories("");
        setDate(format(new Date(), "yyyy-MM-dd"));
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      console.log("Failed to upload data.");
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center min-h-screen px-4">
      <div className="container w-full max-w-screen-lg">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b">
              <CardTitle>Add Marketing Content</CardTitle>
              <CardDescription>
                Enter the details of your marketing text.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., marketing, SEO, sales"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="categories">
                    Categories (comma-separated)
                  </Label>
                  <Input
                    id="categories"
                    placeholder="e.g., digital marketing, content strategy"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(new Date(date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date as any}
                        onSelect={setDate as any}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {" "}
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}

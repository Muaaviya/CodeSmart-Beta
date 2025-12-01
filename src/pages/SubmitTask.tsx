import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../lib/supabase";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { generateReport } from "../lib/ai";

const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "TypeScript",
    "PHP",
    "Swift",
    "Go",
    "Ruby",
];

export default function SubmitTask() {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setError("You must be logged in to submit a task.");
            setLoading(false);
            return;
        }

        if (code.trim().length < 10) {
            setError("Please submit a valid code snippet (min 10 characters)");
            setLoading(false);
            return;
        }

        try {
            const ai_feedback = await generateReport(code, language);

            const { data: insertData, error: insertError } = await supabase
                .from("tasks")
                .insert([
                    {
                        user_id: user.id,
                        title,
                        code,
                        language,
                        ai_result: JSON.stringify(ai_feedback),
                    },
                ])
                .select();

            if (insertError) {
                setError("Failed to save task to database: " + insertError.message);
                return;
            }

            if (insertData && insertData.length > 0) {
                const newTaskId = insertData[0].id;
                navigate(`/view-result/${newTaskId}`);
            } else {
                setError("Failed to get new task ID.");
            }
        } catch (err) {
            setError("Failed to generate AI report. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">
                            New Task Evaluation
                        </CardTitle>
                        <CardDescription>
                            Paste your code below to get an AI-powered evaluation.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="font-bold">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., 'My React Component'"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="language" className="font-bold">
                                        Language
                                    </Label>
                                    <Select onValueChange={setLanguage} defaultValue={language}>
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang} value={lang}>
                                                    {lang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code" className="font-bold">
                                    Code
                                </Label>
                                <Textarea
                                    id="code"
                                    required
                                    minLength={10}
                                    rows={12}
                                    placeholder="Paste your coding task here..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="font-mono bg-muted"
                                />
                            </div>
                            {error && (
                                <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-3 rounded-md border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full text-lg py-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Evaluating...
                                    </>
                                ) : (
                                    "Evaluate"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
}

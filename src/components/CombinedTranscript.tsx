import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Copy, Check, Undo2 } from "lucide-react";
import { useRecognition } from "../context/RecognitionContext";

const CombinedTranscript: React.FC = () => {
    const { fullTranscript, undoLastTranscript } = useRecognition();
    const [copied, setCopied] = useState(false);

    const combinedText = fullTranscript.map((item) => item.text).join(" ");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(combinedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (fullTranscript.length === 0) return null;

    return (
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Combined Transcript</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className={copied ? "text-green-600" : ""}>
                        {copied ? (
                            <>
                                <Check size={16} className="mr-2" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={16} className="mr-2" />
                                Copy
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={undoLastTranscript}
                        disabled={fullTranscript.length === 0}
                        className="text-red-600">
                        <Undo2 size={16} className="mr-2" />
                        Undo
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{combinedText}</p>
            </CardContent>
        </Card>
    );
};

export default CombinedTranscript;

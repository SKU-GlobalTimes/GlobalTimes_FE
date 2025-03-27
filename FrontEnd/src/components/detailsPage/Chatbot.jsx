import { useState, useEffect, useRef } from "react";
import styles from "./Chatbot.module.css";
import { Send } from "lucide-react"; // 아이콘 사용

export default function Chatbot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { type: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }
    ]);
    const chatRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { type: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            setMessages([...newMessages, { type: "bot", text: "현재 학습 중이에요! 더 정확한 답변을 준비할게요." }]);
        }, 1000);
    };

    useEffect(() => {
        // 스크롤을 최신 메시지로 이동
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.chatbot}>
            <div className={styles.chatHeader}>Global AI</div>
            <div className={styles.chatBody} ref={chatRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.type === "bot" ? styles.botMessage : styles.userMessage}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.chatInput}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()} // 엔터로 전송
                />
                <button onClick={handleSend}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}

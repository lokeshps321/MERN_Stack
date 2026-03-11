import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { Send, ArrowLeft, Clock, CheckCircle, MessageSquare, XCircle, AlertCircle } from "lucide-react";
import { authedRequest } from "../utils/request.js";
import { useToast } from "../components/Toast.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useLocalUser } from "../utils/localUser.jsx";

export default function Chat() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { localUser } = useLocalUser();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [requestObj, setRequestObj] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const cancelRequest = async () => {
    if (!confirm("Cancel this request? The listing will become available for others again.")) return;
    
    try {
      setCancelling(true);
      await authedRequest(getToken, {
        method: "patch",
        url: `/api/requests/${id}/status`,
        data: { status: "cancelled" }
      });
      toast("Request cancelled", "success");
      setRequestObj(prev => ({ ...prev, status: "cancelled" }));
      navigate("/dashboard");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to cancel request", "error");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    // We need to fetch the request separately to get listing details.
    // In a real app we'd have a specific endpoint or populate it in messages res.
    // For now we fetch all requests and find this one.
    const loadConversation = async () => {
      try {
        const [reqRes, msgRes] = await Promise.all([
          authedRequest(getToken, { method: "get", url: "/api/requests" }),
          authedRequest(getToken, { method: "get", url: `/api/messages/${id}` })
        ]);

        const req = reqRes.data.requests.find((r) => r._id === id);
        setRequestObj(req);
        setMessages(msgRes.data.messages || []);
      } catch (err) {
        toast("Failed to load messages", "error");
      } finally {
        setLoading(false);
      }
    };
    loadConversation();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      const res = await authedRequest(getToken, {
        method: "post",
        url: `/api/messages/${id}`,
        data: { text }
      });
      setMessages((prev) => [...prev, res.data.message]);
      setText("");
    } catch (err) {
      toast("Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const markAsCompleted = async () => {
    if (!confirm("Mark this transaction as completed? This will mark the listing as sold.")) return;
    
    try {
      setCompleting(true);
      await authedRequest(getToken, {
        method: "patch",
        url: `/api/requests/${id}/status`,
        data: { status: "completed" }
      });
      toast("Transaction completed! Listing marked as sold.", "success");
      setRequestObj(prev => ({ ...prev, status: "completed" }));
      navigate("/dashboard");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to complete transaction", "error");
    } finally {
      setCompleting(false);
    }
  };

  const rejectAfterChat = async () => {
    const reason = prompt("Enter reason for rejection (optional):");
    if (reason === null) return; // User cancelled
    
    try {
      setCompleting(true);
      await authedRequest(getToken, {
        method: "patch",
        url: `/api/requests/${id}/status`,
        data: { status: "rejected" }
      });
      toast("Request rejected. Listing is now available for others.", "success");
      setRequestObj(prev => ({ ...prev, status: "rejected" }));
      navigate("/dashboard");
    } catch (err) {
      toast(err?.response?.data?.error || "Failed to reject request", "error");
    } finally {
      setCompleting(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="flex h-[70vh] items-center justify-center animate-pulse">
      <p className="text-sm text-ink/50">Loading conversation...</p>
    </div>
  );

  if (!requestObj) return (
    <div className="rounded-3xl border border-ink/10 bg-white p-12 text-center">
      <h2 className="text-xl font-semibold">Conversation not found</h2>
      <Link to="/dashboard" className="btn-primary mt-4 inline-flex"><ArrowLeft size={16} /> Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="flex h-[80vh] flex-col overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-premium animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink/10 bg-sand/50 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="rounded-full border border-ink/10 p-2 hover:bg-white transition">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold">{requestObj.listingId?.title || "Listing"}</h2>
            <p className="text-xs text-ink/60 flex items-center gap-1">
              <Clock size={12} /> {new Date(requestObj.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={requestObj.status} />
          {/* Show action buttons for accepted requests */}
          {requestObj.status === "accepted" && (
            <>
              {/* Seller can mark as sold OR reject after chat */}
              {localUser?.role === "seller" && (
                <div className="flex gap-2">
                  <button
                    onClick={rejectAfterChat}
                    disabled={completing}
                    className="btn-outline text-xs py-1.5 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    title="Reject this deal after chat"
                  >
                    <XCircle size={14} /> {completing ? "..." : "Reject Deal"}
                  </button>
                  <button
                    onClick={markAsCompleted}
                    disabled={completing}
                    className="btn-primary text-xs py-1.5 flex items-center gap-1"
                    title="Mark transaction as complete and listing as sold"
                  >
                    <CheckCircle size={14} /> {completing ? "Completing..." : "Mark as Sold"}
                  </button>
                </div>
              )}
              {/* Buyer can cancel */}
              {localUser?.role === "buyer" && (
                <button
                  onClick={cancelRequest}
                  disabled={cancelling}
                  className="btn-outline text-xs py-1.5 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                  title="Cancel this request"
                >
                  <XCircle size={14} /> {cancelling ? "Cancelling..." : "Cancel Request"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-ink/[0.02]">
        {messages.map((m) => {
          const userId = localUser?._id || localUser?.id;
          const isMe = Boolean(userId && m.senderId && String(m.senderId) === String(userId));
          
          return (
            <div key={m._id} className="flex flex-col mb-4">
              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-md ${
                  isMe 
                    ? "rounded-tr-sm bg-ember text-white" 
                    : "rounded-tl-sm bg-white border border-ink/10 text-ink"
                }`}>
                  {m.text}
                  <div className={`mt-1 text-[10px] text-right ${isMe ? "text-white/70" : "text-ink/40"}`}>
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-ink/40">
            No messages yet. Send a message to start!
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-ink/10 bg-white px-6 py-4">
        <form onSubmit={send} className="flex gap-2">
          <input
            className="input rounded-full bg-ink/5 focus:bg-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" disabled={sending} className="btn-primary rounded-full px-4 active:scale-95">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

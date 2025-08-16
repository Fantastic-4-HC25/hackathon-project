import ConversationsList from "@/components/chat/ConversationsList";

// Inside your DashboardPage return:
<div className="grid grid-cols-3 gap-6">
    {/* Left side: conversation list */}
    <div className="col-span-1">
        <ConversationsList onSelect={(id) => {
            setConversationId(id);
            setChatOpen(true);
        }} />
    </div>

    {/* Right side: listings & chat */}
    <div className="col-span-2 space-y-6">
        <ListingsSection
            listings={listings}
            loading={loadingListings}
            onChat={handleChat}
        />

        <ChatWidget
            conversationId={conversationId}
            open={chatOpen}
            onClose={() => setChatOpen(false)}
        />
    </div>
</div>

import { useState, useCallback } from 'react';
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { WelcomeScreen } from './components/WelcomeScreen';
import type { Attachment } from './types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    addMessage,
    updateMessage,
  } = useConversations();

  const handleSendMessage = useCallback(
    (message: import('./types').Message) => {
      if (activeId) {
        addMessage(activeId, message);
      }
    },
    [activeId, addMessage],
  );

  const handleUpdateMessage = useCallback(
    (messageId: string, updates: Partial<import('./types').Message>) => {
      if (activeId) {
        updateMessage(activeId, messageId, updates);
      }
    },
    [activeId, updateMessage],
  );

  const { isStreaming, sendMessage, cancelStream } = useChat({
    onSendMessage: handleSendMessage,
    onUpdateMessage: handleUpdateMessage,
    conversationId: activeId,
  });

  const handleNewChat = useCallback(() => {
    createConversation();
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [createConversation]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setActiveId(id);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    },
    [setActiveId],
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      deleteConversation(id);
    },
    [deleteConversation],
  );

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
      />

      {/* Main content */}
      <main className="relative flex flex-1 flex-col overflow-hidden" id="main-content">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-transparent" aria-hidden="true" />

        {activeConversation ? (
          <ChatView
            conversation={activeConversation}
            messages={activeConversation.messages}
            isStreaming={isStreaming}
            onSend={(content, attachments) =>
              sendMessage(content, attachments as Attachment[] | undefined)
            }
            onCancel={cancelStream}
            onToggleSidebar={handleToggleSidebar}
            onDeleteConversation={handleDeleteConversation}
          />
        ) : (
          <WelcomeScreen onNewChat={handleNewChat} />
        )}
      </main>
    </div>
  );
}
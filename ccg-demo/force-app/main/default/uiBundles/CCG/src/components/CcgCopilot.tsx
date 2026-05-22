import { AgentforceConversationClient } from '@salesforce/ui-bundle-template-feature-react-agentforce-conversation-client';

// CCG Copilot — live in ccg-scratch as of 5/22/2026.
export const CCG_AGENT_ID = '0XxBi0000000ROPKA2';

export default function CcgCopilot() {
  return (
    <AgentforceConversationClient
      agentId={CCG_AGENT_ID}
      agentLabel="CCG Copilot"
      styleTokens={{
        fabBackground: '#2c7da0',
        containerBackground: '#ffffff',
        containerWidth: '400px',
        containerHeight: '600px',
        chatBorderRadius: '0px',
        chatBoxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
        headerBlockBackground: '#2c7da0',
        headerBlockTextColor: '#ffffff',
        headerBlockIconColor: '#ffffff',
        headerBlockFontFamily: 'Inter, sans-serif',
        headerBlockFontWeight: '600',
        headerBlockFontSize: '12.5px',
        headerBlockBorderRadius: '0px',
        headerBlockPadding: '14px 18px',
        bodyBlockBackground: '#ffffff',
        bodyBlockPadding: '16px',
        welcomeBlockFontFamily: 'Inter, sans-serif',
        welcomeBlockTextColor: '#1f2937',
        welcomeBlockFontSize: '12.5px',
        welcomeBlockPadding: '10px 14px',
        messageBlockFontFamily: 'Inter, sans-serif',
        messageBlockFontSize: '12.5px',
        messageBlockLineHeight: '1.5',
        messageBlockBorderRadius: '12px',
        messageBlockPadding: '10px 14px',
        messageBlockMaxWidth: '78%',
        messageBlockMinWidth: '78%',
        messageBlockWidth: '78%',
        messageBlockMarginBottom: '10px',
        messageBlockInboundBackgroundColor: '#f3f5f8',
        messageBlockInboundTextColor: '#1f2937',
        messageBlockOutboundBackgroundColor: '#2c7da0',
        messageBlockOutboundTextColor: '#ffffff',
        messageInputBorderRadius: '10px',
        messageInputPadding: '10px 14px',
        messageInputFontFamily: 'Inter, sans-serif',
        messageInputFontSize: '12.5px',
        messageInputFooterBackground: '#ffffff',
        messageInputFooterPadding: '12px 16px 14px 16px',
        messageInputFooterBorderColor: '#e5e7eb',
        messageInputFooterBorderFocusColor: '#2c7da0',
        messageInputFooterSendButton: '#2c7da0',
        messageInputFooterSendButtonHoverColor: '#1f6280',
        messageInputFooterPlaceholderText: '#9ca3af',
        messageInputFooterPlaceholderTextFontSize: '12.5px',
      }}
    />
  );
}

export default function AgentforcePill({ children = 'Agentforce' }: { children?: React.ReactNode }) {
  return (
    <span className="cg-pill cg-sparkle">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.39 6.95L21 11l-6.61 2.05L12 20l-2.39-6.95L3 11l6.61-2.05L12 2zM19 3l.95 2.05L22 6l-2.05.95L19 9l-.95-2.05L16 6l2.05-.95L19 3zM5 14l.95 2.05L8 17l-2.05.95L5 20l-.95-2.05L2 17l2.05-.95L5 14z" />
      </svg>
      {children}
    </span>
  );
}

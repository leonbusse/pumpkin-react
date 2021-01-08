import React from "react";

export class ErrorBoundary extends React.Component<{}, { error?: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error: error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("An error occured", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

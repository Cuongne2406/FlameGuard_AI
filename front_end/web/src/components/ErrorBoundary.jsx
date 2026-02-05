import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-8 bg-red-50 text-red-900 min-h-screen font-mono">
                    <h1 className="text-2xl font-bold mb-4">⚠️ Đã xảy ra lỗi hệ thống (Something went wrong)</h1>
                    <p className="mb-4">Vui lòng chụp ảnh màn hình này và gửi cho lập trình viên để khắc phục.</p>

                    <div className="bg-white p-4 rounded shadow border border-red-200 overflow-auto">
                        <h2 className="font-bold text-red-600 mb-2">{this.state.error && this.state.error.toString()}</h2>
                        <details className="whitespace-pre-wrap text-sm text-gray-700">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Tải lại trang
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

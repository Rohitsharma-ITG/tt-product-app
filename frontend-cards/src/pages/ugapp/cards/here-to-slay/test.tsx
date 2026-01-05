import React from "react";

type props = {
    name: string;
};

const AdditionalPage: React.FC<props> = ({ name }) => {
    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                padding: "24px",
                backgroundColor: "#f9f9f9",
            }}
        >
            {/* Page Heading */}
            <h1 style={{ fontSize: "28px", marginBottom: "24px" }}>Additional page</h1>

            <div style={{ display: "flex", gap: "24px" }}>
                {/* Main Content */}
                <div style={{ flex: 3 }}>
                    <section
                        style={{
                            marginBottom: "24px",
                            backgroundColor: "#fff",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
                            Multiple pages
                        </h2>
                        <p
                            style={{
                                marginBottom: "12px",
                                lineHeight: "1.6",
                                color: "#333",
                            }}
                        >
                            The app template comes with an additional page which demonstrates
                            how to create multiple pages within app navigation using{" "}
                            <a
                                href="https://shopify.dev/docs/apps/tools/app-bridge"
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#0066cc", textDecoration: "underline" }}
                            >
                                App Bridge
                            </a>
                            .
                        </p>
                        <p
                            style={{
                                marginBottom: "12px",
                                lineHeight: "1.6",
                                color: "#333",
                            }}
                        >
                            To create your own page and have it show up in the app navigation,
                            add a page inside{" "}
                            <code
                                style={{
                                    backgroundColor: "#eee",
                                    padding: "2px 4px",
                                    borderRadius: "4px",
                                }}
                            >
                                app/routes
                            </code>
                            , and a link to it in the{" "}
                            <code
                                style={{
                                    backgroundColor: "#eee",
                                    padding: "2px 4px",
                                    borderRadius: "4px",
                                }}
                            >
                                &lt;ui-nav-menu&gt;
                            </code>{" "}
                            component found in{" "}
                            <code
                                style={{
                                    backgroundColor: "#eee",
                                    padding: "2px 4px",
                                    borderRadius: "4px",
                                }}
                            >
                                app/routes/app.jsx
                            </code>
                            .
                        </p>
                    </section>
                </div>

                {/* Sidebar */}
                <aside style={{ flex: 1 }}>
                    <section
                        style={{
                            backgroundColor: "#fff",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
                            Resources
                        </h3>
                        <ul style={{ paddingLeft: "20px", color: "#333" }}>
                            <li>
                                <a
                                    href="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#0066cc", textDecoration: "underline" }}
                                >
                                    App nav best practices
                                </a>
                            </li>
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default AdditionalPage;

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const fullName = formData.get("fullName");
  const password = formData.get("password");

  const response = await fetch(
    `${process.env.API_SERVER}/api/v1/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    }
  );
  
  // Use the request URL to create an absolute URL for the redirect to the home page
  const authUrl = new URL(process.env.NEXTAUTH_URL! ?? "http://localhost:5173");
  const reqUrl = new URL(request.url)
  const redirectUrl = new URL("/",  reqUrl.hostname === "0.0.0.0" ? authUrl.origin : request.url);
  console.log("request.url: ", request.url)

  if (response.ok) {
    return NextResponse.redirect(redirectUrl.toString());
  } else {
    // Redirect back to the form with an error message as a query parameter
    const error = await response.json();
    const errorMessage = encodeURIComponent(
      error.detail || "Registration failed"
    );
    const errorRedirectUrl = new URL(
      `/signup?error=${errorMessage}`,
      redirectUrl
    );
    return NextResponse.redirect(errorRedirectUrl.toString());
  }
}

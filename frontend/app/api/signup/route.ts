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

  if (response.ok) {
    // Use the request URL to create an absolute URL for the redirect to the home page
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl.toString());
  } else {
    // Redirect back to the form with an error message as a query parameter
    const error = await response.json();
    const errorMessage = encodeURIComponent(
      error.detail || "Registration failed"
    );
    const errorRedirectUrl = new URL(
      `/signup?error=${errorMessage}`,
      request.url
    );
    return NextResponse.redirect(errorRedirectUrl.toString());
  }
}

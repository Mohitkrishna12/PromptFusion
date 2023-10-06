"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const path = usePathname();
  const router = useRouter();
  console.log(path);

  useEffect(() => {
    (async () => {
      const res: any = await getProviders();
      setProviders(res);
    })();
  }, []);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logogn1.png"
          alt="logo"
          width={45}
          height={45}
          className="object-contain"
        />
        <p className="logo_text">
          Prompt<span className="green_gradient">Fusion</span>
        </p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        <div className="flex gap-3 md:gap-5">
          <Link
            href="/ai-image"
            className={`py-1.5 px-3 transition-all font-bold text-base ${
              path === "/ai-image" ? "green_gradient" : "text-white"
            } hover:text-gray-300 text-center font-inter flex items-center justify-center`}
          >
            Ai-Image
          </Link>
          <Link
            href="/prompt"
            className={`py-1.5 px-3 transition-all font-bold text-base ${
              path === "/prompt" ? "green_gradient" : "text-white"
            } hover:text-gray-300 text-center font-inter flex items-center justify-center`}
          >
            Prompt
          </Link>
          {session?.user ? (
            <>
              <Link
                href={
                  path === "/ai-image" || path === "/prompt"
                    ? "/create" + path
                    : ""
                }
                className={`py-1.5 px-5 transition-all font-bold text-base ${
                  path.includes("/create") ? "green_gradient" : "blue_gradient"
                } hover:text-gray-300 text-center font-inter flex items-center justify-center`}
              >
                Create
              </Link>
              {/* <button
              type="button"
              onClick={() => signOut()}
              className="outline_btn"
            >
              Sign Out
            </button> */}
              <div className="relative">
                <Image
                  src={session?.user.image || ""}
                  width={37}
                  height={37}
                  className="rounded-full"
                  alt="profile"
                  onClick={() => setToggleDropdown(!toggleDropdown)}
                />

                {toggleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/20 rounded-lg shadow-lg p-2 space-y-2">
                    {/* <button
                      type="button"
                      onClick={() => {
                        router.push("/profile");
                        setToggleDropdown(false);
                      }}
                      className="mt-2 w-full black_btn"
                    >
                      My Profile
                    </button> */}
                    <button
                      type="button"
                      onClick={() => {
                        setToggleDropdown(false);
                        signOut();
                      }}
                      className="mt-2 w-full black_btn"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              {/* <Link href="/profile">
              <Image
                src={session?.user?.image || ""}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link> */}
            </>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider: any) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    className="outline_btn"
                  >
                    Sign in
                  </button>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        <Link
          href="/ai-image"
          className={`py-1.5 px-3 transition-all font-bold text-base ${
            path === "/ai-image" ? "green_gradient" : "text-white"
          } hover:text-gray-300 text-center font-inter flex items-center justify-center`}
        >
          Ai-Image
        </Link>
        <Link
          href="/prompt"
          className={`py-1.5 px-3 transition-all font-bold text-base ${
            path === "/prompt" ? "green_gradient" : "text-white"
          } hover:text-gray-300 text-center font-inter flex items-center justify-center`}
        >
          Prompt
        </Link>
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image || ""}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className="dropdown !bg-white/20">
                <Link
                  href={
                    path === "/ai-image" || path === "/prompt"
                      ? "/create" + path
                      : ""
                  }
                  className="py-1.5 px-5 w-full bg-black rounded-md transition-all font-bold text-white text-base text-center hover:text-gray-300 font-inter flex items-center justify-center"
                >
                  Create
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="py-1.5 px-5 font-bold w-full bg-black rounded-md text-white text-base"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider: any) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className="outline_btn"
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

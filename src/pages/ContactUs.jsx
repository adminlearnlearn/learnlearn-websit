import { Send } from "lucide-react";

function ContactUs() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <div>
          <h1 className="mb-8 text-5xl font-bold underline decoration-2 underline-offset-8">
            Contact us
          </h1>

          <form className="max-w-md space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                placeholder="e.g.@email.com"
                className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="e.g. john jaidee"
                className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Message</label>
              <textarea
                rows="4"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600"
            >
              Send <Send size={16} />
            </button>
          </form>

          <div className="mt-12">
            <h2 className="mb-8 text-center text-2xl font-medium">
              Contact Channels
            </h2>

            <div className="flex items-center gap-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 font-bold text-white">
                LINE
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                f
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-700 text-3xl">
                ☎
              </div>

              <div className="text-lg leading-8">
                <p>02-xxxxxxxx</p>
                <p>02-xxxxxxxx</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/contact.png"
            alt="Contact"
            className="w-full max-w-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
import Link from "next/link";


const Form = ({ type, submitting, handleSubmit,title,subTitle,children }:any) => {
  return (
    <section className="w-full max-w-full flex-start flex-col mb-16">
      <h1 className="head_text text-left">
        <span className="green_gradient">{type+" "+title}</span>
      </h1>
      <p className="desc text-left max-w-md">
        {subTitle} 
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        {children}
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-300 text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;

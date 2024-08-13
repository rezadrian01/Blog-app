import { Link, Form } from "react-router-dom";
import AuthInput from "../../components/UI/AuthInput";
import googleLogo from "../../assets/google logo.svg";

export default function Signup() {
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    // console.log(data);
  }
  return (
    <div className="flex justify-center">
      <div className=" w-11/12 sm:w-4/6 md:w-1/2 lg:w-1/3 flex flex-col bg-slate-100 h-[90vh] rounded shadow-lg mt-10 p-4">
        <div className="mb-32 mt-10">
          <h1 className="text-4xl font-semibold">Signup</h1>
          <p className="text-slate-600 mt-2">
            Already Have an Account?{" "}
            <span className="text-blue-500 font-semibold hover:underline">
              <Link to="..">Signin Here</Link>
            </span>
          </p>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-between h-[50vh]">
            <div className="flex flex-col gap-12">
              <AuthInput label="Email Address" name="email" />
              <AuthInput label="Username" name="name" />
              <AuthInput label="Password" name="password" password />
            </div>
            <div className="flex flex-col gap-2 text-center">
              <button className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600">
                Signup
              </button>
              {/* <p>or</p> */}
              <button
                type="button"
                className="border-2 border-gray-400 px-4 py-2 rounded flex items-center justify-center gap-2"
              >
                <img className="w-7 h-7" src={googleLogo} />
                Signin With Google
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

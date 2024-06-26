---
title: "Language Interoprability"
date: 2023-12-05
time: 1-2 p.m. EST
location: Online
thumbnail: /assets/images/events/why-mapping.jpg
alt: abstract art, made up of splotches of multicolored paint
registerurl: https://www.eventbrite.com/e/virtual-talk-why-mapping-some-lessons-from-an-art-historians-dh-ditch-tickets-770377498837?aff=oddtdtcreator
categories:
  - Talks
tags:
  - Spatial Analysis
teaser: >
  Learn more about digital mapping's importance for humanistic research at this virtual talk by Prof. Jinah Kim (Harvard). In addition to discussing new and ongoing DH mapping projects, Prof. Kim will connect DH's spatial turn to theoretical developments in art history and explain why mapping matters in the age of climate crisis.
---

## C++ Language Interoperability Layer

### Overview

The C++ programming language is used for many numerically intensive scientific applications. A combination of performance and solid backward compatibility has led to its use for many research software codes over the past 20 years. Despite its power, C++ is often seen as difficult to learn and inconsistent with rapid application development. Exploration and prototyping is slowed down by the long edit-compile-run cycles during development. Exploratory programming is an effective way to gain a deeper understanding of a project’s requirements; reduce the complexity of a problem; and provide an early validation of the system’s design and implementation. This is amongst the strengths of Python and a major design goal of new languages such as Julia, D and Swift.

Two of the most widely used languages by researchers are C++ and Python [1]. Python has grown steadily as a language of choice for data science and application control. The interactive nature of Python and its many available libraries make it an excellent choice for scripting tasks and code prototyping. However, native computational performance of Python is mediocre. Python includes functionality for replacing the most critical components of a processing kernel with implementations in C. This functionality is insufficient to fully cover many scientific use cases because crossing the language boundary is expensive due to limitations in current tools.

This document describes key aspects of language interoperability with C++ using an automated binding approach. The primary initial focus is to support automatic binding to and from Python, however the approach is generic enough to fit other languages such as D and Julia. The document shows a prototype using the proposed language interoperability layer capable of instantiating a C++ template from within Python.

### Background

Most widely used set of python binding tools are usually static binding generators with their own parsers. They include SWIG [2] and SIP [3]. They require user code to steer the generation process because of their limited parsers and the insufficient type introspection. The custom language allows the user to fill in the missing introspection information or work around unsupported features in the parsers. These tools have limited C++ support and require many manual interventions.

There is another set of tools such as Boost.Python [4] and Pybind11 [5]. They are C++ APIs on top of the Python C-API, which has limited capabilities and hides important details such as C++-specific memory management patterns (eg. reference counting). These tools have better C++ support but still require manual interventions. For example, the library author needs to write code to define the needed language bindings.

Despite the continuous improvements in the tools generating language bindings it has a fundamental design limitation: they are primarily designed for use by programmers, or by library authors who want to provide language bindings.

The rise of C++ interpreters (notably Cling [6]) lifted this limitation by allowing on-demand automatic bindings to be built for any well-behaved C++ package. On-demand bindings bring improved performance and ease of development and use. They can enable efficient code development and debugging, while also bringing a production runtime benefit. In particular, cppyy [9] uses introspection information available in the C++ interpreter to generate bindings on the fly, and is currently the only fully dynamic Python binding generator. One of Julia’s C++ interoperability packages, Cxx.jl, takes a similar approach [7]. While existing binders work during library development, Cppyy and Cxx.jl work during runtime and can bind code from arbitrary libraries.

The common binding approaches can be classified into static and on-demand (or dynamic) bindings. Static bindings (e.g., those generated by Pybind11) are implemented as a series of invocations to Python APIs to create the needed run-time structures. Static bindings are often inefficient because they are partly in C++ but partly in Python. In some cases they need to use redundant trampoline functions to match object inheritance semantics.

Dynamic approaches suffer from a common misconception that building something dynamically is necessarily slow. Instead, the execution performance bottleneck of the dynamic system is the interpretative language environment that needs to access C++ codes. In fact, the cppyy approach shows better performance than pybind11 [8] [9]. The approach of Cppyy can be further improved by replacing its interoperability layer based on parsing strings. We propose a more efficient implementation in this document.

State of the art for Dynamic Binding based implementations
The dynamic bindings approach requires a compiler instance which is alive during the entire execution of the program. This way it can provide the necessary information about C++ types on demand. In addition, the compiler should be able to handle multiple requests which means it should provide some minimal support for incremental compilation. That is, the compiler should work as a library, which can be interfaced via an API and be used as a service. Very few compilers are designed to work this way. One such compiler is the Clang [10] compiler which can work as a library.

Cling and recently Clang-Repl use Clang as a library to implement incremental compilation. The incremental compilation enables interpreter-like tools but also keeps an active compiler instance at runtime. For example, Cling implements a facility, LookupHelper, which we illustrate in Listing 1, that takes a (perhaps qualified) C++ code and checks if a declaration with that qualified name already exists.
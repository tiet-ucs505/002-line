# 002 : Line Drawing #

## Usage ##

Either use [VSCode/Live-Server
Extension](https://github.com/tiet-ucs505/001-pixel#with-vscodelive-server-extension)
or use
[BrowerSync](https://github.com/tiet-ucs505/001-pixel#with-browsersync)

## Line Drawing ##

Given an image space $\Omega\subset\mathbb{Z}^2$ with
resolution $[W,H]^T$.  A point (or a pixel) is denoted
as $[x_a,y_a]^T\equiv\mathbf{a}\in\Omega$. 

Color value at pixel $\mathbf{a}$ is denoted as a point
in unit cube,
$\mathrm{color}\_{\nu}(\mathbf{a})\in\mathbb{R}^D_{[0,1]}$,
where $D$ represents channel depth. $D=1$ for a bitmap
or a grayscale image; $D=3$ for RGB; and $D=4$ for
RGBA. For all practical purposes, the color value is
resolved into an integer value with 8-bit depth and
discretised for ease of representation and storage, so
that
$\mathrm{color}(\mathbf{a})\in\mathbb{Z}^D_{[0,255]}$.

### Naïve ###


Given points $\mathbf{p},\mathbf{q}\in\Omega$ and line
resolution $N$, compute and plot on canvas, the set of
points $\mathbb{S}_p$ as follows:

```math
\begin{align}
  \notag
  r(t) &= \left\lceil(1-t)\mathbf{p} + t\mathbf{q}
    \right\rceil
  \\
  %
  \mathbb{S}_p&\equiv
  \{\mathbf{x}_i=r(i/N):
    0\leqslant i\in\mathbb{Z}\leqslant N\}
\end{align}
```

where, $\lceil\mathbf{v}\rceil$ denotes ceiling
truncation for all components of vector $\mathbf{v}$.

### DDA Algo ###

#### Optimising for $N$ ####

We resolve the line into pixel counts into the larger
of the distance between the two endpoints resolved into
each of the axes; and compute the value of the
ordinates along the other axis.

So, $N = \max(|x_{p-q}|, |y_{p-q}|)$.

If $|y_{p-q}| < |x_{p-q}|$,
```math
\begin{align}
\notag
y_i &= \left\lceil y_q + i\frac{y_{p-q}}{x_{p-q}} 
  \right\rceil
\\
%
\notag
x_i &= x_q + i\times\mathrm{sgn}(x_{p-q})
\end{align}
```

Otherwise,
```math
\begin{align}
\notag
x_i &= \left\lceil x_q + i\frac{x_{p-q}}{y_{p-q}} 
  \right\rceil
\\
%
\notag
y_i &= y_q + i\times\mathrm{sgn}(y_{p-q})
\end{align}
```


And finally,
```math
\begin{align}
\mathbb{S}_p &= \{
  [x_i,y_i]^T:0\leqslant i\in\mathbb{Z} \leqslant N
  \}
\end{align}
```


#### Optimising for arithmetic operations ####

Precomputing,

```math
\begin{align}
    \notag
    m &= \frac{y_{p-q}}{x_{p-q}}
    \\
    %
    \notag
    m' &= \frac{x_{p-q}}{y_{p-q}}
    \\
    %
    \notag
    r(0) &= \mathbf{q}
\end{align}
```

We can rewrite the sequence as the following
recurrence,

```math
\begin{align}
\mathrm{inc}(i) &= \begin{cases}
[\mathrm{sgn}(x_{p-q}), m]^T, &\text{if}\quad |y_{p-q}|
< |x_{p-q}|; \\
[m', \mathrm{sgn}(y_{p-q})]^T, &\text{otherwise.}
\end{cases}
\\
r(i) &= r(i-1) + inc(i) \\
\mathbb{S}_p &= \{r(i):0\leqslant i\in\mathbb{Z}
\leqslant N\}
\end{align}
```

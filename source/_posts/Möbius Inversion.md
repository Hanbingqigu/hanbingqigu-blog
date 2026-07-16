---
title: Möbius Inversion
date: 2025-10-29 09:47:28
author: Hanbingqigu
categories:
  - 算法·理论
---

# 莫比乌斯反演 / Möbius Inversion Formula

## 前言 / 絮叨

$\color{orange} \bold{\text{Warning}}$：本篇文章所讲**不是常见的数论中的莫比乌斯反演！！！**

这篇文章真的写了好久好久……深深地感受到自己的弱小……而且还有很多要写想写的东西，后面肯定会 update 的。

### 一些记号

+ 对于集合 $A,B$，定义 $A \times B = \set{(x, y) \mid x \in A, y \in B}$。这被称为**笛卡尔积**。
+ 对于集合 $A$，用 $|A|$ 表示 $A$ 的元素个数。
+ 对于集合 $A$，用 $2^A$ 表示 $A$ 的所有子集构成的集合，即 $\set{S \mid S \subseteq A}$。这被称为 $A$ 的**幂集**。
+ $\bigcup_{P(S)} S$ 和 $\bigcap_{P(S)} S$ 分别表示所有满足 $P(S)$的 $S$ 的并和交。需要特别说明的是，若不存在满足 $P(S)$ 的 $S$，$\bigcup_{P(S)} S = \varnothing$，$\bigcap_{P(S)} S = U$，其中 $U$ 是全集。
+ 为了方便，定义 $[n]$ 表示集合 $\set{1,2,\dots,n}$。
+ 为了方便，对于正整数 $n$ 和质数 $p$，用 $p(n)$ 表示 $n$ 在质因数分解后 $p$ 的指数。
+ 为了方便，对于集合 $A,B$，如果存在一个 $A,B$ 间的双射 $\varphi$，我们可能也会说 $A=B$，并且可能混用两个集合的元素。
+ 对于性质 $P(x)$，$\sum_{P(x)}f(x)$ 表示对**所有**满足性质 $P(x)$ 的元素 $x$ 求和。当然这需要对 $x$ 的集合有限定，不过通常在没有歧义的情况下会省略。

## 偏序集

定义集合（通常是有限集）$P$ 和定义在 $P$ 上的二元关系偏序关系 $\le_P$ 组成一个偏序集 $(P, \le_P)$。

偏序的性质：

- 自反性： $\forall a \in P,a \le a$。
- 传递性： $a \le b, b \le c \implies a \le c$。
- 反对称性： $a \le b, b \le a \implies a = b$。

注意：$a \ge b$ 和 $a \nleq b$ 的含义是不同的，后者包含了 $a$ 和 $b$ **不可比**的情况。

下文中，没有歧义的情况下会用 $a \le b$ 代替 $a \le_P b$，用 $a < b$ 代替 $a \le_P b \land a \ne b$，用 $P$ 代替偏序集 $(P, \le_P)$。

我们来考察一些在偏序集上定义特殊的函数：$f: P \times P \to \mathbb{R}$ 满足 $\forall x \nleq y,f(x,y)=0$。也就是说 $f(x,y)\ne 0$ 仅当 $x \le y$。

类比矩阵乘法，可以定义这些函数的「矩阵乘法」：
$$
f,g: P \times P \to \mathbb{R} \\  
(f * g)(x, y) = \sum_{z \in P} f(x,z) g(z,y) \\
$$
由于只有 $x \le z \le y$ 时 $(f * g)(x,y) \ne 0$ 所以可以写作：
$$
(f*g)(x,y)=\sum_{x \le z \le y} f(x,z) g(z,y)
$$
这相当于是两个「方阵」相乘。

当然也有向量和方阵的乘法：
$$
f: P \to \mathbb{R},g: P \times P \to \mathbb{R} \\
(f*g)(x) = \sum_{z \le x} f(z) g(z, x) \\
(g*f)(x) = \sum_{z \ge x} g(x, z) f(z)
$$
这里不要求 $f$ 是满足特殊性质的函数。前者相当于行向量右乘方阵， 后者相当于列向量左乘方阵。

容易证明这种运算具有结合律而不具有交换律。

同样可以定义这个 $*$ 运算的单位元 $\delta(x,y)=\begin{cases}1 & \text{if }\;x=y.\\0&\text{otherwise.}\end{cases}$ 和逆元，单位元性质可自行验证。

## Möbius 函数

下面引入一个重要函数：
$$
\zeta(x,y)=
\begin{cases}
1 &\text{if } \; x \le y. \\
0 &\text{otherwise.}
\end{cases}
$$
简单理解就是偏序关系的判定函数（或者是当作艾弗森括号）。通过这个工具，就可以将求和改写成「矩阵乘法」的形式：
$$
f(x)=\sum_{y \le x} g(y) = \sum_{y \le x} g(y)\zeta(y,x) \iff f = g * \zeta \\
f(x)=\sum_{y \ge x} g(y) = \sum_{y \ge x} \zeta(x,y)g(y) \iff f = \zeta * g
$$
而我们的主角 **Möbius 函数** $\mu$ 就是 $\zeta$ 函数的**逆元**，也就是说：
$$
\boxed{\mu*\zeta=\delta}
$$
即：
$$
\sum_{x \le z \le y} \mu(x,z) \zeta(z, y)=
\sum_{x \le z \le y} \mu(x,z)=
\delta(x,y)=
\begin{cases}
1 & \text{if }\;x=y.\\
0&\text{otherwise.}
\end{cases}
$$
显然，当 $x=y$ 时 $\mu(x, y) = 1$，当 $x \nleq y$ 时 $\mu(x, y)=0$，重点来看  $x < y$ 的那一部分。

当 $x < y$ 时 $\delta(x, y) = 0$，所以：
$$
\sum_{x \le z \le y} \mu(x, z)=0
$$
把 $\mu(x, y)$ 那一项拆出来，移项得：
$$
\mu(x, y) = -\sum_{x \le z < y} \mu(x,z)
$$
由此，我们就得到了 Möbius 函数的**递推式**：
$$
\boxed{
\mu(x,y)=
\begin{cases}
1 & \text{if } \; x = y. \\
-\sum_{x \le z < y} \mu(x,z) & \text{if } \; x < y. \\
0 & \text{otherwise.}
\end{cases}
}
$$

### 乘积公式

另外，Möbius 函数还有一个重要性质：**乘积公式**：

设 $P, Q$ 是两个有限偏序集，定义 $P \times Q$ 的偏序关系为：$(p_1,q_1) \le_{P \times Q} (p_2, q_2)$ 当且仅当 $p_1 \le_P p_2 \land q_1 \le_Q q_2$。

**乘积公式**：
$$
\boxed{\mu_{P \times Q}((p_1, q_1), (p_2,q_2)) = \mu_P(p_1, p_2) \cdot \mu_Q(q_1,q_2)}
$$
证明：

设 $f((p_1, q_1), (p_2, q_2)) = \mu_P(p_1, p_2) \cdot \mu_Q(q_1,q_2)$，

要证明原定理，只需证明：$f * \zeta_{P \times Q} = \delta_{P \times Q}$。

直接验证：
$$
\begin{align}
(f * \zeta)((p_1, q_1), (p_2, q_2)) &= \sum_{(p_1, q_1) \le (p, q) \le (p_2, q_2)} f((p_1, q_1), (p, q)) \cdot \zeta((p, q), (p_2, q_2)) \\
&= \sum_{(p_1, q_1) \le (p, q) \le (p_2, q_2)} f((p_1, q_1), (p, q)) \\
&= \sum_{p_1 \le p \le p_2} \sum_{q_1 \le q \le q_2} \mu_P(p_1, p) \cdot \mu_Q(q_1,q) \\
&= \bigg(\sum_{p_1 \le p \le p_2} \mu_P(p_1, p)\bigg) \cdot \bigg( \sum_{q_1 \le q \le q_2} \mu_Q(q_1,q) \bigg)
\end{align}
$$
由 Möbius 函数定义：$\sum_{x \le z \le y} \mu(x,z)= \delta(x,y)$ 不难发现左边就是 $\delta_P(p_1, p_2)$ 右边是 $\delta_Q(q_1, q_2)$，也就是：
$$
(f * \zeta)((p_1, q_1), (p_2, q_2)) = \delta_P(p_1, p_2) \cdot \delta_Q(q_1, q_2)
$$
根据 $P \times Q$ 上偏序关系的定义：$\delta_Q(q_1, q_2) \cdot \delta_P(p_1, p_2) = \delta_{P \times Q}((p_1, q_1), (p_2, q_2))$ （乘法相当于是与运算了），那么就证明了 $f * \zeta_{P \times Q} = \delta_{P \times Q}$ 也就证明了原定理。

## Möbius 反演

有了 $\zeta$ 函数的逆有什么用呢？当然是可以在乘法等式中快乐移项啦！

由此有 **莫比乌斯反演公式 / Möbius Inversion Formula**：
$$
f = g * \zeta \iff g = f * \mu \\
f = \zeta * g \iff g = \mu * f
$$
这里的 $f, g$ 都是向量，也就是 $P \to \mathbb{R}$。

换成求和的形式（应用前面所说的将求和化为「矩阵乘法」）：
$$
\boxed{f(x) = \sum_{y \le x} g(y) \iff g(x) = \sum_{y \le x} f(y) \mu(y, x)} \\
\boxed{f(x) = \sum_{y \ge x} g(y) \iff g(x) = \sum_{y \ge x} \mu(x, y) f(y)}
$$

这两个公式非常重要，后面会经常用到。

## 整数偏序集

现在我们给偏序集来一个具体的例子。

考察偏序集 $([n],\le)$ ，其中 $[n] = \set{x \in \mathbb{N}^* \mid 1 \le x \le n}$，这里的 $\le$ 就是整数间的大小关系，显然满足偏序关系的定义。这个偏序集上的Möbius函数长什么样子呢？

由 Möbius 函数的递推式可得：
$$
\mu (x, x + 1) = -\mu(x, x) = -1
$$
再推几项：
$$
\mu(x,x+2)=-\mu(x,x)-\mu(x,x+1)=-1-(-1)=0 \\
\mu(x,x+3)=-\mu(x,x)-\mu(x,x+1)-\mu(x,x+2)=0
$$
再往下递推下去，发现 $\mu(x, x)$ 和 $\mu(x, x + 1)$ 刚好抵消，后面全是 $0$。对此运用数学归纳法：

基础：$\mu(x, x + 2) = 0$

归纳：若 
$$
\forall 2 \le k \le n,\mu(x, x + k) = 0
$$
成立，则：
$$
\begin{align}
\mu(x,x + n + 1) 
&= -\sum_{k=0}^{n}\mu(x,x+k) \\
&= -\mu(x,x)-\mu(x,x+1)-\sum_{k=2}^n\mu(x,x+k) \\
&= -1 - (-1) - 0 \\
&= 0
\end{align}
$$
因此：
$$
\forall 2 \le k \le n+1,\mu(x,x+k)=0
$$
成立。于是就得到了整数偏序集上的 Möbius 函数：
$$
\boxed{
\mu(x,y)=
\begin{cases}
1& \text{if } \; x = y. \\
-1& \text{if } \; x + 1= y. \\
0& \text{otherwise.}
\end{cases}
}
$$

那整数偏序集上的 Möbius 反演长什么样呢？写出公式：
$$
f(x) = \sum_{1 \le y \le x} g(y) \iff g(x) = \sum_{1 \le y \le x} f(y) \mu(y, x)
$$
根据刚才的 Möbius 函数公式，发现只有 $y = x - 1$ 时 $\mu(y, x) = -1$，$y = x$ 时 $\mu(y, x) = 1$，其他全是 $0$，那么有：
$$
\boxed{f(x) = \sum_{1 \le y \le x} g(y) \iff g(x) = f(x) - f(x - 1)}
$$
> 严谨起见，上面的公式仅对 $x \ge 2$ 有定义。当 $x = 1$ 时，不存在 $y = x - 1$，即不存在 $\mu(y,x)=-1$ 的项。因此，$f(1)=g(1) \iff g(1)=f(1)$。

你发现了什么？前一个公式中 $f(x)$ 不就是 $g(x)$ 的**前缀和**吗？而相应的，后一个公式表明了 $g(x)$ 是 $f(x)$ 的**差分**！

是的，前缀和与差分的转换是 Möbius 反演在整数偏序集上的特例！似乎毫无关系的两者居然竟然有如此深刻的联系，在网上没找到过相关的资料（也许是我太菜），当我推导出它的时候被深深的震惊到了，也许这就是数学的魅力吧。

## 子集偏序集

我们继续来考察另外的一些偏序集，比如说考察偏序集 $(2^U, \subseteq)$。其中 $U$ 是研究对象全体，$2^U$ 是 $U$ 的**幂集**，也就是 $U$ 的所有子集构成的集合。不难证明 $\subseteq$ 是一种偏序关系。

来算算 Möbius 函数吧！怎么算呢？这就是**乘积公式**大展身手的时候了！我们知道子集可以表示为一个唯一的 $\texttt{01}$ 串，表示一个元素在不在这个子集里，也就是说：
$$
2^U= \prod_{x_i \in U} \set{0, 1}
$$
这里的 $\prod$ 是**笛卡尔积**，$0/1$ 就表示没选/选这个元素，当然 $0 \le 1$。不难发现一个集合包含于另一个集合当且仅当每一位上都小于等于，这就有了笛卡尔积偏序关系。方便起见设 $P_i = \set{0,1}$，那么 $2^U = \prod_{x_i \in U} P_i$，乘积公式不就来了：
$$
\mu_{2^U}(A, B) = \prod_{x_i \in U} \mu_{P_i}(A_i, B_i)
$$
这里可能需要理解一下，$A_i \in \set{0, 1}$ 就表示 $A$ 中有没有 $x_i$ 这个元素。或者把 $A,B$ 看作 $\texttt{01}$ 串，$A_i, B_i$ 就是字符串的第 $i$ 位，整个字符串上的 Möbius 函数就是取每一位上的 Möbius 函数乘起来（这里我也想了好久）。

根据之前整数偏序集上的 Möbius 函数（那里是从 $1$ 开始，这里是从 $0$ 开始，这无所谓）可以得到：
$$
\mu(0, 0) = 1 \\
\mu(1, 1) = 1 \\
\mu(1, 0) = 0\\
\mu(0, 1) = -1
$$
那就把他们乘起来吧！

显然，$\mu_{2^U}(A, B) = 0$ 的条件是**存在一个元素在 $A$ 中出现过而在 $B$ 中没出现过**（也就是有 $\mu(1, 0)$ 这一项），说白了就是 $A \nsubseteq B$。也就是非 $0$ 的条件是 $A \subseteq B$。

再考虑非 $0$ 的情况，就是一堆 $1$ 和一堆 $-1$ 乘起来，最后肯定是个 $1$ 或者 $-1$，而且只跟 $-1$ 的数量有关系，也就是 $\mu(0, 1)$ 的数量。$\mu(0, 1)$ 的数量是啥呢？就是**在 $A$ 中没出现，但在 $B$ 中出现了的元素个数**，由于 $A \subseteq B$，其实就是 $|B|-|A|$。

把它们整合起来，就得到：
$$
\boxed{
\mu(A, B) =
\begin{cases}
(-1)^{|B|-|A|} & \text{if } \; A \subseteq B. \\
0 & \text{otherwise.}
\end{cases}
}
$$
看着是不是有容斥系数那味了？

### 容斥原理

设有 $n$ 个性质集合 $A_i \subseteq U$，用下标的集合 $[n]$ 的幂集作为子集偏序集。

做如下定义：
$$
f(I) = \bigg |\bigcap_{i \in I}A_i \bigg|
$$
即**钦定 $I$ 中所有性质必须满足，其他性质满不满足无所谓**的元素个数。

> 有时这被称为至少满足 $I$ 中的性质。另外，至多满足 $I$ 中的性质的元素个数就是**钦定不能选择非 $I$ 中的性质，$I$ 中的性质满不满足无所谓**的元素个数。

$$
g(I) = \bigg|\set{x \mid x\in\bigcap_{i \in I}A_i,x \notin \bigcup_{i \notin I} A_i}\bigg|
$$

即**钦定 $I$ 中所有性质必须满足，其他性质不能满足**的元素个数。

> 有时这被称为恰好满足 $I$ 中性质。

为了方便理解，这里贴张图：

![](https://cdn.luogu.com.cn/upload/image_hosting/ea9zl9xy.png)

比如 $f(\set{1, 2}) = |② \cup ⑤|$ 而 $g(\set{1, 2}) = |②|$（这里 $⑤$ 就是所谓满足了其他性质的区域）

通常情况下，$f(I)$ 要更好求，因为**钦定**这个条件比较宽松，于是我们就自然而然地想到能否用 $f(I)$ 去求 $g(I)$。根据反演步骤，先用 $g$ 去表示 $f$，想要求至少满足了 $I$ 中所有性质的元素个数，那就枚举恰好满足了哪些性质的集合 $J \supseteq I$ ，求 $\sum_{J \supseteq I} g(J)$，也就是：
$$
f(I) = \sum_{J \supseteq I} g(J)
$$
根据 Möbius 反演（注意这里是 $\ge$ 的形式，也就是第二个公式）：
$$
\boxed{g(I) = \sum_{J \supseteq I} \mu(I, J) f(J) = \sum_{J \supseteq I} (-1)^{|J| - |I|} f(J)}
$$
特别的：
$$
g(\varnothing) = \text{不满足任何性质的元素个数} = \bigg|\bigcap \overline{A_i}\bigg| = \bigg|\overline{\bigcup A_i}\bigg|
$$
代入一下，也就得到了：
$$
\boxed{\bigg|\overline{\bigcup A_i}\bigg| = \sum_{I \subseteq [n]} (-1)^{|I|}\cdot  \bigg|\bigcap_{i \in I}A_i\bigg|}
$$
这就是**容斥原理**的补集形式。没想到吧，容斥原理也跟 Möbius 反演有着密不可分的关系！

## 整除偏序集

考虑 $N$ 的约数集 $D_N = \set{d \in \mathbb{N}^* \; \mid \; d \mid N}$ （通常来讲，可以假设 $N$ 足够大，也就是所有有关数字的 $\operatorname{lcm}$，这样可以看作是无限集）和偏序关系 $|$ (整除）组成的偏序集 $(D_N, |)$，不难验证整除是一种偏序关系。

当然，研究数论问题最有力的武器就是质因数分解，那么对一个整数 $x$ 质因数分解：
$$
x = \prod_{p \in primes} p^{p(x)}
$$
那么任意一个 $x \in D_N$ 就可以写作一些 $p(x)$ 的元组，并且 $x \mid y$ 当且仅当 $\forall p \in primes,p(x) \le p(y)$，这就有了运用乘积公式的条件。具体的，
$$
D_N = \prod_{p \in primes} [p(N)+1]
$$
其中 $\prod$ 是笛卡尔积。注意这里 $p(N)$ 可以取到 $0$，所以元素个数要加 $1$。那么：
$$
\mu_{D_N}(x, y) = \prod_{p \in primes} \mu_{[p(N)+1]}(p(x), p(y))
$$
可以类似于子集偏序集的来分析，回顾整数偏序集上的 Möbius 函数：
$$
\mu(x,y)=
\begin{cases}
1& \text{if } \; x = y. \\
-1& \text{if } \; x + 1= y. \\
0& \text{otherwise.}
\end{cases}
$$
首先可以发现 $\mu(x,y) = 0$ 的条件是$\exists p, p(x) > p(y)$ 或者 $\exists p, p(y) - p(x) > 1$， 也就是 $x \nmid y$ 或者 $\frac x y$ 的质因数分解**任意指数大于** $1$。那么非 $0$ 的条件就是 $x \mid y$ 并且 **$\frac x y$ 每个质数的指数至多为 $1$**，也就是分解为若干不相同质数的积。

非 $0$ 的情况中，只考虑 $-1$ 的数量，那么可以发现就是 $\frac x y$ 质因数分解的质数个数。于是得到：
$$
\boxed{
\mu(x, y) =
\begin{cases}
1 & \text{if } \; x = y. \\
(-1)^r  & \text{if } \frac x y \text{ is the product of } r \text{ distinct primes.} \\
0 & \text{otherwise.}
\end{cases}
}
$$

因为 $\mu(x, y)$ 只跟 $\frac x y$ 有关，因此在数论场景中，一般会定义 $\mu(\frac x y) = \mu(x,y)$。也就是 $\mu(n) = \mu(n,1)$，这样就得到了经典的 Möbius 函数：
$$
\boxed{
\mu(n) =
\begin{cases}
1 & \text{if } \; n=1. \\
(-1)^r  & \text{if } n \text{ is the product of } r \text{ distinct primes.} \\
0 & \text{otherwise.}
\end{cases}
}
$$
那么我们就得到了数论中的 Möbius 反演：
$$
\boxed{f(n) = \sum_{d \mid n} g(d) \iff g(n) = \sum_{d \mid n} \mu(\frac n d) f(d)} \\
\boxed{f(n) = \sum_{n \mid d} g(d) \iff g(n) = \sum_{n \mid d} \mu(\frac d n) f(d)}
$$

## Change Log

finished on 11/4/2025。

updated on 11/4/2025。猎奇 luogu 很多 LaTeX 语法不支持，已修改。修改了一些笔误。修改了一些逻辑问题。

updated on 5/23/2025。精简了一些内容。添加了记号说明。对一些细节问题做了更精细的阐释。修改了一些笔误。
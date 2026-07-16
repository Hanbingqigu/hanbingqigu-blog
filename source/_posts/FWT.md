---
title: FWT
date: 2026-02-24 19:55:03
author: Hanbingqigu
categories:
  - 算法·理论
---

# 快速沃尔什变换 / FWT

下文中为行文方便，所有序列的长度为 $n = 2^m$。另外，本文可能反复混用二进制数和集合，如将交并说成与或等，当然这通常是无歧义的。另外，$x_i \in \set{0,1}$ 通常表示 $x$ 在二进制表示下的第 $i$ 位，至于是从高位还是从低位是无所谓的。

## Faster Convolution

FWT (快速沃尔什变换) 用于解决这样一类位运算卷积问题：
$$
C_k=\sum_{i \circ j = k} A_i B_j
$$
其中 $\circ$ 运算表示一类位运算，如 $\cap$ $\cup$ $\oplus (\text{xor})$ 等。朴素算法的复杂度显然是 $\mathcal O(n^2)$ 的，而 FWT 算法可以在 $\mathcal O(n \log n)$ 内完成。

FWT 的核心思想是构造一种变换 $\mathcal F$，使得：
$$
C_k=\sum_{i \circ j = k} A_i B_j \iff \mathcal F[C]_k = \mathcal F[A]_k \cdot \mathcal F[B]_k
$$
在变换 $\mathcal F$ 下，将位运算卷积*展平*成了**逐点相乘**（Hadamard 积），这使得乘法的复杂度立刻下降。只要找到了满足条件的变换 $\mathcal F$ 和其逆变换 $\mathcal F^{-1}$，整个问题就迎刃而解了。

## Transform & Matrix

变换 $\mathcal F$ 可以写成一个矩阵 $P$，也就是 $\mathcal F[A] = AP$ (行向量右乘矩阵)。由于：
$$
\mathcal F[C]_k = \mathcal F[A]_k \cdot \mathcal F[B]_k
$$
因此：
$$
(CP)_k=(AP)_k \cdot (BP)_k
$$
即：
$$
\begin{align}
\sum_{i=0}^{n-1} C_iP_{k,i} 
&= \bigg(\sum_{i=0}^{n-1} A_iP_{k,i}\bigg) \cdot \bigg(\sum_{i=0}^{n-1} B_iP_{k,i}\bigg) \\
&= \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} A_i B_j P_{k,i} P_{k,j}
\end{align}
$$
带入 $C_i$ 的定义：
$$
\sum_{i=0}^{n-1} \sum_{j=0}^{n-1} A_i B_j P_{k,i \circ j} = \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} A_i B_j P_{k,i} P_{k,j}
$$
为了对于任意的 $A,B$ 都要成立，这必须要求：
$$
\boxed{P_{k,i \circ j} = P_{k,i} P_{k,j}}
$$
上式给出了矩阵 $P$ 成立的充要条件。

一个很平凡的 $P$ 是全 $0$ 或者全为一个值，但是平凡的构造通常有一个平凡的效果：想想，如果全 $0$，那么 $\mathcal F$ 得到的所有结果都是**零向量**！他们当然是永远相等的，但这显然不是我们想要的效果。

究其原因，是因为这样的 $P$ 不存在逆，就像基督教失去了耶路撒冷。不存在逆矩阵，也就不存在逆变换 $\mathcal F^{-1}$，问题也就没有最终解决。

在着手构造矩阵前，还有一个问题需要面对：$P$ 的规模是 $n \times n$ 的，这大大提高了构造的难度，而且跟 $n$ 相关的代价是，我们必须为每个 $n$ 构造不同的 $P$！这是不可接受的。

## 'Bitwise' Operation

迄今为止，我们对 FWT 的探索还没有利用到一个关键前提：$\circ$ 是一种**位**运算。不要小瞧了这一性质，这决定这为什么加法卷积(即 $a \circ b = a + b$)比位运算卷积复杂得多。位运算意味着可以按位计算（废话），也就是：
$$
(a \circ b)_k=a_k \circ b_k
$$
其中 $a_k \in \set{0,1}$ 表示 $a$ 二进制下的第 $k$ 位。因此，$\circ$ 仅需对 $\set{0,1}$ 定义。

这启示我们，能否对 $P$ 做缩减？事实上，$P$ 也可以按位构造。具体地，我们可以定义 $2 \times 2$ 的**位矩阵** $D$，并且定义：
$$
P_{i,j}=\prod_{t=0}^{m-1} D_{i_t,j_t}
$$
这样就生成了完整的 $P$。这样生成的 $P$ 有如下结论：

结论 1：
$$
D_{k,i \circ j} = D_{k,i} D_{k,j} \implies P_{k,i \circ j} = P_{k,i} P_{k,j}
$$

证明：
$$
\begin{align}
P_{k, i \circ j} 
&= \prod_{t=0}^{m-1} D_{k_t,(i \circ j)_t} \\
&= \prod_{t=0}^{m-1} D_{k_t,i_t \circ j_t} \\
&= \prod_{t=0}^{m-1} D_{k_t,i_t} D_{k_t,j_t} \\
&= P_{k,i} P_{k,j}
\end{align}
$$

结论 2：
$$
D \, \text{存在逆} \implies P \, \text{存在逆}
$$

事实上，$P$ 的逆 $P^{-1}$ 由如下方式给出：
$$
P^{-1}_{i,j} = \prod_{t=0}^{m-1} D^{-1}_{i_t,j_t}
$$
证明：
$$
\begin{align}
(PP^{-1})_{i,j} 
&= \sum_{k=0}^{n-1} P_{i,k} P^{-1}_{k,j} \\
&= \sum_{k=0}^{n-1} \prod_{t=0}^{m-1} D_{i_t,k_t} D^{-1}_{k_t,j_t} \\
&= \sum_{k_0=0}^1 \sum_{k_1=0}^1 \cdots \sum_{k_{m-1}=0}^1 \prod_{t=0}^{m-1} D_{i_t,k_t} D^{-1}_{k_t,j_t} \\
&= \prod_{t=0}^{m-1} \sum_{k_t=0}^1 D_{i_t,k_t} D^{-1}_{k_t,j_t} \\
&= \prod_{t=0}^{m-1} [i_t = j_t] \\
&= [i=j]
\end{align}
$$
为了理解第三步，你需要充分发挥你的想象力，因为枚举子集相当于枚举每个元素是否在子集内，这两者是等价的。另外，第四步运用了简单的求和法则的扩展：
$$
\sum_i \sum_j a_i b_j = \bigg(\sum_i a_i \bigg) \bigg(\sum_j b_j \bigg)
$$
以上两条性质说明：一个合法的 $D$ 就意味着无数个合法的 $P$。这样，问题的规模就大大缩减了，仅需构造一个满足条件的小矩阵即可。

## The End...?

问题得到解决了吗？我们已经构造出了 $P$，只需要给序列乘上 $P$，就得到了变换之后的结果。将结果向量逐点相乘，再乘上 $P^{-1}$，最终得到了卷积之后的答案……吗？

可惜，$P$ 的规模是 $n \times n$ 的，也就是说，为了得到变换之后的序列，我们需要 $\mathcal O(n^2)$ 的时间复杂度。但是暴力的复杂度不就是 $\mathcal O(n^2)$ 的吗？做了个寂寞……

这就是整个算法最巧妙的地方。我们考察 $P$ 的生成方式：
$$
P_{i,j} = \prod_{t=0}^{m-1} D_{i_t,j_t}
$$
如果设 $i$ 去掉第0位的数字为 $i'$，那么就有：
$$
P_{i,j}=P_{i',j'} D_{i_0,j_0}
$$
这是很有效的，因为直接将规模缩小了一半。由此：
$$
\begin{align}
\mathcal F[A]_{k} 
&= \sum_{i=0}^{n-1} A_i P_{k,i} \\
&= \sum_{i=0}^{n-1} A_i P_{k',i'} D_{k_0,i_0}
\end{align}
$$
这里 $P_{k,i}$ 的规模已经小了一半，我们还需要将 $A_i$ 的规模缩小，这启示用 $i_0$ 分组：
$$
\begin{align}
\mathcal F[A]_{k} 
&= \sum_{i=0}^{n/2-1} A_i P_{k',i'} D_{k_0,i_0} + \sum_{i=n/2}^{n-1} A_i P_{k',i'} D_{k_0,i_0}\\
&= D_{k_0,0} \sum_{i=0}^{n/2-1} A_i P_{k',i'} + D_{k_0,1} \sum_{i=n/2}^{n-1} A_i P_{k',i'}
\end{align}
$$
这样子问题就非常明显了。只需将 $A_i$ 按 $i_0$ 划分为 $A_0$ 和 $A_1$，那么：
$$
\begin{align}
\mathcal F[A]_k
&= D_{k_0,0} \sum_{i=0}^{n/2-1} {A_0}_{i'} P_{k',i'} + D_{k_0,1} \sum_{i=0}^{n/2-1} {A_1}_{i'} P_{k',i'} \\
&= D_{k_0,0} \mathcal F[A_0]_{k'} + D_{k_0,1} \mathcal F[A_1]_{k'}
\end{align}
$$
这样做的目的是将 $i$ 同一固定为 $i'$ 。就可以直接递归下去解决问题了。设计算长度为 $n$ 的 $\mathcal F[A]$ 复杂度为 $T(n)$，那么就有：
$$
T(n) = 2T(\frac n 2) + \mathcal O(1)
$$
因此：
$$
T(n) = \mathcal O(n\log n)
$$
对于 $\mathcal F^{-1}$ 来说，仅需将 $P_{i,j}$ 换为 $P^{-1}_{i,j}$ 即可。由于两个矩阵的构造方式都是一样的（通过位矩阵按位乘），因此同样可以解决。这样，我们就在 $\mathcal O(n \log n)$ 的复杂度彻底解决了这个问题。

最后，观察式子 $\mathcal F[A]_k = D_{k_0,0} \mathcal F[A_0]_{k'} + D_{k_0,1} \mathcal F[A_1]_{k'}$，可以将 $\mathcal F[A]$ 继续用 $k_0$ 来分组为 $\mathcal F[A]_0$ 和 $\mathcal F[A]_1$，这样就可以写成：
$$
{\mathcal F[A]_0}_k = D_{0,0} \mathcal F[A_0]_{k} + D_{0,1} \mathcal F[A_1]_{k} \\
{\mathcal F[A]_1}_k = D_{1,0} \mathcal F[A_0]_{k} + D_{1,1} \mathcal F[A_1]_{k}
$$
这里的 $k'$ 也简化为了 $k$。上式很像矩阵乘法的模式，我们可以简化地写为：
$$
\boxed {[\mathcal F[A]_0, \mathcal F[A]_1] = [\mathcal F[A_0], \mathcal F[A_1]] \times D}
$$
这里对于一个数乘一个序列的定义是 $(\lambda A)_k = \lambda A_k$，即向量数乘。

附：一些常见运算的矩阵构造

与（$\cap$）：
$$
D = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix} \quad \quad D^{-1}= \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}
$$
或（$\cup$）：
$$
D = \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix} \quad \quad D^{-1}= \begin{bmatrix} 1 & 0 \\ -1 & 1 \end{bmatrix}
$$
异或（$\oplus$）：
$$
D = \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix} \quad \quad D^{-1}= \begin{bmatrix} \frac{1}{2} & \frac{1}{2} \\ -\frac{1}{2} & \frac{1}{2} \end{bmatrix}
$$
由于只需按行满足 $D_{k,i \circ j} = D_{k,i} D_{k,j}$，因此交换两行不会有影响（有用的废话）。

